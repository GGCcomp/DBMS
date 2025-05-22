import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");
    io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("chat-message", (msg) => {
        console.log("Received message:", msg);
        io.emit("chat-message", msg); // Broadcast to all connected clients
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  } else {
    console.log("Socket.IO server already running.");
  }

  res.end();
}
