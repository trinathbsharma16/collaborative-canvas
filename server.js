import express from "express";
import http from "http";
import { Server } from "socket.io";
import { createRoomManager } from "./rooms.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const roomManager = createRoomManager();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId, username) => {
    roomManager.joinRoom(roomId, socket.id, username);
    socket.join(roomId);

    io.to(roomId).emit("userList", roomManager.getUsers(roomId));
  });

  socket.on("draw", (roomId, drawData) => {
    roomManager.addDrawOperation(roomId, drawData);
    socket.to(roomId).emit("draw", { userId: socket.id, drawData });
  });

  socket.on("undo", (roomId) => {
    const undoOp = roomManager.undo(roomId);
    io.to(roomId).emit("undo", undoOp);
  });

  socket.on("redo", (roomId) => {
    const redoOp = roomManager.redo(roomId);
    io.to(roomId).emit("redo", redoOp);
  });

  socket.on("disconnect", () => {
    const roomId = roomManager.leaveRoom(socket.id);
    if (roomId) io.to(roomId).emit("userList", roomManager.getUsers(roomId));
  });
});

app.use(express.static("client"));

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
