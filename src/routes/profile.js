const express = require("express");
const profileRouter = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../model/user");
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies; //COOKIES REMEMBETR NOT COOKIE
    const { token } = cookie;
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
    if (decodedMessage) {
      const { _id } = decodedMessage;
      const user = await User.find({ _id: _id });
      res.send(user);
    } else {
      throw new Error("ERROR : No user found");
    }
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
});

//GET API
profileRouter.get("/feed", userAuth, async (req, res) => {
  const emailId = req.body?.emailId;
  try {
    const users = await User.find({});
    if (users.length != 0) {
      res.send(users);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (err) {
    res.status(500).send("Somethig went wrong");
  }
});

//UPDATE

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  const AllowedFields = [
    "firstName",
    "lastName",
    "address",
    "phoneNumber",
    "interests",
    "photo",
    "age",
    "gender",
  ];
  try {
    const data = req.body;
    const isAllowedToEdit = Object.keys(data).every((k) =>
      AllowedFields.includes(k)
    );
    if (isAllowedToEdit) {
      const user = req.user;
      const result = await User.findByIdAndUpdate(user._id, data, {
        runValidators: true,
      });
      res.json({ message: "Updated User", data: result });
    } else {
      throw new Error("Not Allowed");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = { profileRouter };
