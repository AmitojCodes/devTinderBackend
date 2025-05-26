const express = require("express");
const userRouter = express.Router();
const { ConnectionRequestModel } = require("../model/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const { User } = require("../model/user");

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user = req.user._id;
    const requests = await ConnectionRequestModel.find({
      toUserId: user,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photo",
      "age",
      "gender",
    ]);
    res.json({
      data: requests,
    });
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: user._id, status: "accepted" },
        { fromUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "_id",
        "firstName",
        "lastName",
        "emailId",
        "photo",
        "age",
        "gender",
      ])
      .populate("toUserId", [
        "_id",
        "firstName",
        "lastName",
        "photo",
        "emailId",
        "age",
        "gender",
      ]);

    const data = connections.map((row) => {
      if (row.toUserId._id.equals(user._id)) return row.fromUserId;
      else return row.toUserId;
    });

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const user = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ toUserId: user._id }, { fromUserId: user._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((k) => {
      hideUsersFromFeed.add(k.fromUserId);
      hideUsersFromFeed.add(k.toUserId);
    }); //no duplicate values

    const data = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select([
        "_id",
        "firstName",
        "lastName",
        "photo",
        "emailId",
        "age",
        "gender",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    //MY LOGIC
    // const user = req.user;
    // const feed = await User.find({
    //   $nor: [{ _id: user._id }],
    // }).select([
    //   "_id",
    //   "firstName",
    //   "lastName",
    //   "photo",
    //   "emailId",
    //   "age",
    //   "gender",
    // ]);

    // const ignoredList = await ConnectionRequestModel.find({
    //   $or: [{ toUserId: user._id }, { fromUserId: user._id }],
    // });
    // const ignoredData = ignoredList.flatMap((row) => [
    //   row.toUserId.toString(),
    //   row.fromUserId.toString(),
    // ]);

    // //donot show password
    // const data = feed.filter(
    //   (row) => !ignoredData.includes(row._id.toString())
    // );

    if (data.length == 0) {
      return res.status(404).json({
        message: "No Users",
      });
    }
    res.json({
      data: data,
    });
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
});

module.exports = { userRouter };
