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
