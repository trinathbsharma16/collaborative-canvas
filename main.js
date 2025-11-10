import { initCanvas } from "./canvas.js";
import { initWebSocket } from "./websocket.js";

const username = prompt("Enter your name:");
const roomId = "default-room";

const socket = initWebSocket(roomId, username);
initCanvas(socket);
