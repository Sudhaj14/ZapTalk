const express = require("express");
const { protectRoute } = require("../middleware/auth");
const {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} = require("../controllers/messageController");

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

module.exports = messageRouter;
