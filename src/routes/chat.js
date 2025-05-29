const express = require("express");
const { Chat } = require("../model/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const user = req.user;
  const targetUserId = req.params?.targetUserId;
  try {
    const ans = await Chat.findOne({
      participants: { $all: [user?._id, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photo",
    });

    if (!ans) {
      const chat = new Chat({
        participants: [user?._id, targetUserId],
        messages: [],
      });
      await chat.save();
      return res.status(201).json({
        messages: chat.messages,
      });
    }

    res.json({
      messages: ans.messages,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = { chatRouter };
