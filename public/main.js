const socket = io("http://localhost:4000", {
  authConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, ...args);
});

// 전역 변수들
const chatBody = document.querySelector(".chat-body");
const userTitle = document.getElementById("user-title");
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
