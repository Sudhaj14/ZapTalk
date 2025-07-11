const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { connectDB } = require("./lib/db");
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const { Server } = require("socket.io");

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
const io = new Server(server, {
  cors: { origin: "*" },
});
module.exports.io = io;

// Store online users
const userSocketMap = {}; // { userId: socketId }
module.exports.userSocketMap = userSocketMap;

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB and start server
connectDB().then(() => {
  if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
  }
});

// Export server for Vercel
module.exports = server;
