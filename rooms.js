import { createDrawingState } from "./drawing-state.js";

export function createRoomManager() {
  const rooms = {};

  return {
    joinRoom(roomId, socketId, username) {
      if (!rooms[roomId]) {
        rooms[roomId] = { users: {}, drawingState: createDrawingState() };
      }
      rooms[roomId].users[socketId] = { username };
    },
    leaveRoom(socketId) {
      for (const [roomId, room] of Object.entries(rooms)) {
        if (room.users[socketId]) {
          delete room.users[socketId];
          return roomId;
        }
      }
      return null;
    },
    getUsers(roomId) {
      return Object.values(rooms[roomId]?.users || {});
    },
    addDrawOperation(roomId, op) {
      rooms[roomId]?.drawingState.addOperation(op);
    },
    undo(roomId) {
      return rooms[roomId]?.drawingState.undo();
    },
    redo(roomId) {
      return rooms[roomId]?.drawingState.redo();
    },
  };
}
