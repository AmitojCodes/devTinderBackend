const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../model/connectionRequest");
const { User } = require("../model/user");

requestRouter.post(
  "/request/profile/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const status = req.params?.status;
      const toUserId = req.params?.toUserId;
      if (fromUserId.equals(toUserId)) {
        console.log("hllo");
        return res.status(400).json({
          message: "User cannot send request to himself",
        });
      }

      const AllowedStatus = ["interested", "ignored"];
      console.log(toUserId);

      const validUser = await User.findById(toUserId);

      if (validUser) {
        const userAllowedtoChangeStatus = AllowedStatus.includes(status);
        if (userAllowedtoChangeStatus) {
          const existingConnectionRequest =
            await ConnectionRequestModel.findOne({
              $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
              ],
            });
          if (existingConnectionRequest) {
            return res.status(400).json({
              message: "Connection Already Exists",
            });
          }
          const connection = new ConnectionRequestModel({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status,
          });
          await connection.save();
          res.send("Connect Requset Send");
        } else {
          res.status(400).json({
            message: "Invalid Status " + status,
          });
        }
      } else {
        res.status(400).json({
          message: `Invalid UserId: ${toUserId}`,
        });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user._id;
      const status = req.params?.status;
      const requestId = req.params?.requestId;

      //status Validation
      const AllowedStatus = ["accepted", "rejected"];
      if (!AllowedStatus.includes(status)) {
        return res.status(404).json({
          message: `Invalid status : ${status}`,
        });
      }

      //requestId validation
      const request = await ConnectionRequestModel.findById(requestId);
      if (!request) {
        return res.status(404).json({
          message: `Invalid requestId : ${requestId}`,
        });
      }

      //toUserId === loggedInuserId
      if (!user.equals(request.toUserId)) {
        return res.status(404).json({
          message: `Method not allowed`,
        });
      }

      //status === interested
      if (!(request.status === "interested")) {
        return res.status(404).json({
          message: `Method not allowed`,
        });
      }

      request.status = status;

      await request.save();
      res.json({
        message: "Request accepted",
        data: request,
      });
    } catch (err) {
      res.status(500).send("ERROR : " + err.message);
    }
  }
);

module.exports = { requestRouter };
