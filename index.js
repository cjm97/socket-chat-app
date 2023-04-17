const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {

  socket.username = "";

  io.emit("chat message", "user has connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", `${socket.username}: ${msg}`);
  });

  socket.on("setUsername", (username) => {
    socket.username = username;

    io.emit("username", username);
  });

  socket.on("typing message", () => {
    socket.broadcast.emit("typing message", `${socket.username} is typing...`);
  })

  socket.on("disconnect", () => {
    io.emit("chat message", "a user has disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
