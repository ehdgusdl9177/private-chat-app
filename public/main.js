const socket = io("http://localhost:4000", {
  authConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, ...args);
});

// 전역 변수들
const chatBody = document.querySelector(".chat-body");
const userTitle = document.getElementById("#user-title");
const loginContainer = document.querySelector(".login-container");
const userTable = document.querySelector(".user");
const userTagline = document.querySelector("#user-tagline");
const title = document.getElementById("#active-user");
const messages = document.querySelector(".messages");
const msgDiv = document.querySelector(".msg-form");

// login form handler
const loginForm = document.querySelector(".user-login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementsById("username");
  createSession(username.value.toLowerCase());
  username.value = "";
});

const createSession = async (username) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  };
  await fetch("/session", options)
    .then((res) => res.json())
    .then((data) => {
      socketConnect(data.username, data.userId);
      // localstorage에 세션을 Set
      localStorage.setItem("session-username", data.username);
      localStorage.setItem("sesstion-userId", data.userId);

      loginContainer.classList.add("d-none");
      chatBody.classList.remove("d-none");
      userTitle.innerHTML = data.username;
    })
    .catch((err) => console.log(err));
};

const socketConnect = async (username, userId) => {
  socket.auth = { username, userId };

  await socket.connect();
};

socket.on("users-data", ({ users }) => {
  // 자신은 제거하기
  const index = users.findIndex((user) => user.userId === socket.id);
  if (index > -1) {
    users.splice(index, 1);
  }

  // user table list 생성하기
  let ul = `<table class="table table-hover">`;
  for (const user of users) {
    ul += `<tr class="socket-users" onclick="setActiveUser(this, '${user.username}', '${user.userId}')">
              <td>${user.username}<span class="text-danger ps-1 d-none" 
              id="${user.userId}">!</span></td>
            </tr>`;
  }
  ul += `</table>`;
  if (users.lengthj > 0) {
    userTable.innerHTML = ul;
    userTagline.innerHTML = "접속 중인 유저";
    userTagline.classList.add("text-success");
    userTagline.classList.remove("text-danger");
  } else {
    userTagline.innerHTML = "접속 중인 유저 없음";
    userTagline.classList.remove("text-success");
    userTagline.classList.add("text-danger");
  }
});

const sessUsername = localStroage.getItem("sesstion-username");
const sessUserId = localStorage.getItem("session-userId");

if (sessUsername && sessUserId) {
  socketConnect(sessUsername, sessUserId);

  loginContainer.classList.add("d-none");
  chatBody.classList.remove("d-none");
  userTitle.innerHTML = sessUsername;
}
