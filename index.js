const express = require("express");
const path = require("path");
const app = express();
const crypto = require("crypto");

const http = require("http");
const { Server } = require("socket.io");
const { default: mongoose } = require("mongoose");
const server = http.createServer(app);
const io = new Server(server);

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://k23129177:qwer1234@expree-cluster.9j385iu.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("디비 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

const randomId = () => {
  crypto.randomBytes(8).toString("hex");
};

app.post("/session", (req, res) => {
  const data = {
    username: req.body.username,
    userId: randomId(),
  };
  res.send(data);
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  const userId = socket.handshake.auth.userId;
  if (!username) {
    return next(new Error("Invalid username"));
  }
  socket.username = username;
  socket.id = userId;
  next();
});

let users = [];
io.on("connection", async (socket) => {
  let userData = {
    username: socket.username,
    userId: socket.id,
  };
  users.push(userData);
  io.emit("users-data", { users });

  // 클라이언트에서 보내온 메시지
  socket.on("message-to-server", () => {});

  // 데이터베이스에서 메시지 가져오기
  socket.on("fetch-messages", () => {});

  // 유저가 방에서 나갔을 때
  socket.on("disconnect", () => {});
});

const port = 4000;
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
