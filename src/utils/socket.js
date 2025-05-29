const socket = require("socket.io");
const { Chat } = require("../model/chat");
const { ConnectionRequestModel } = require("../model/connectionRequest");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(`User ${firstName} with ID ${userId} joined room: ${roomId}`);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ text, userId, sender, time, status, targetUserId, photo }) => {
        //Save to database
        try {
          const roomId = [userId, targetUserId].sort().join("_");
          console.log(`Message from ${sender} in room ${roomId}: ${text}`);
          // Check if the chat already exists

          const isFriend = await ConnectionRequestModel.findOne({
            $and: [
              {
                $or: [
                  { toUserId: userId, fromUserId: targetUserId },
                  { toUserId: targetUserId, fromUserId: userId },
                ],
              },
              { status: "accepted" },
            ],
          });

          if (!isFriend) {
            console.log("not a friend");
            return;
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text: text,
            time: time,
            status: status,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", {
            text,
            userId,
            sender,
            time,
            status,
            targetUserId,
            photo,
          });
        } catch (err) {
          console.log(err.message);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
