export function initWebSocket(roomId, username) {
  const socket = io();

  socket.emit("joinRoom", roomId, username);

  socket.on("userList", (users) => {
    document.getElementById("userList").innerHTML =
      "<b>Online:</b><br>" + users.map(u => u.username).join("<br>");
  });

  return socket;
}
