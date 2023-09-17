$(document).ready(function () {
  const socket = io();

  const username = prompt("Enter your username:");
  socket.emit("user_connected", username);

  const userList = $("#user-list");
  const messageInput = $("#message-input");
  const messageList = $("#message-list");
  const sendButton = $("#send-button");

  sendButton.click(() => {
    const message = messageInput.val();
    socket.emit("chat_message", message);
    messageInput.val("");
  });

  messageInput.keypress(() => {
    socket.emit("typing");
  });

  socket.on("chat_message", (data) => {
    messageList.append(
      `<li><strong>${data.username}:</strong> ${data.message}</li>`
    );
    scrollToBottom();
  });

  socket.on("user_connected", (username) => {
    userList.append(
      `<li class="user-connected">${username} joined the chat</li>`
    );
    scrollToBottom();
  });

  socket.on("user_disconnected", (username) => {
    userList.append(
      `<li class="user-disconnected">${username} left the chat</li>`
    );
    scrollToBottom();
  });

  socket.on("typing", (username) => {
    $(".typing").remove();
    userList.append(`<li class="typing">${username} is typing...</li>`);
    scrollToBottom();
  });

  function scrollToBottom() {
    messageList.scrollTop(messageList[0].scrollHeight);
  }
});
