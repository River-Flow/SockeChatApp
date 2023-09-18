require('dotenv').config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  socket.on("user_connected", (username) => {
    socket.username = username;
    io.emit("user_connected", username);
  });

  socket.on("chat_message", (message) => {
    io.emit("chat_message", { username: socket.username, message });
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.username);
  });

  socket.on("disconnect", () => {
    io.emit("user_disconnected", socket.username);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
