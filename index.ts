import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

import {
  addUserToRoom,
  getCurrentUsers,
  getCurrentUser,
  removeCurrentUser,
  RoomUser,
} from "./utils";

// room-message, message, current-users

const app = express();
const PORT = process.env.PORT || 5000;
const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let num = 0;

app.use(cors());
app.use(express.json());

dotenv.config();

io.on("connection", (socket) => {
  console.log(`Someone joined ${++num}`);

  // Client connects
  socket.on("room", (currentUser: { username: string; room: string }) => {
    // Get the user info
    const { username, room } = currentUser;
    const user = addUserToRoom(socket.id, username, room);

    // Join room
    socket.join(user.room);

    // Display message that user has joined
    console.log(`User ${user.username} has joined ${user.room}`);

    socket.to(user.room).emit("room-message", {
      type: "RoomMessage",
      roomMessage: `${user.username} has joined`,
    });

    // Send current user info to all room users
    io.to(user.room).emit("current-users", {
      room: user.room,
      users: getCurrentUsers(user.room),
    });
  });

  // Listen for messages
  socket.on("message", (message) => {
    const user = getCurrentUser(socket.id);
    // Send message from the current user
    if (user) {
      io.to(user.room).emit("message", {
        type: "ChatMessage",
        username: user.username,
        message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  });

  // If current user disconnects
  socket.on("disconnect", () => {
    console.log("Someone disconnected");

    // Update current users
    const user = removeCurrentUser(socket.id);
    if (user) {
      io.to(user.room).emit("room-message", {
        type: "RoomMessage",
        roomMessage: `${user.username} has left`,
      });

      io.to(user.room).emit("current-users", {
        room: user.room,
        users: getCurrentUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));