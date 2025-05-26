const express = require("express");
const authRouter = express.Router();
const { User } = require("../model/user");
const bcrypt = require("bcrypt"); // Correct
const jwt = require("jsonwebtoken");
const { validation } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("User or Password not found!!!");
    } else {
      const idPasswordValid = await bcrypt.compare(password, user.password);
      if (idPasswordValid) {
        const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
          expiresIn: "1h",
        }); // Secret Key
        res.cookie("token", token);
        res.send(user);
      } else {
        res.status(401).send("Unauthorized");
      }
    }
  } catch (err) {
    res.status(500).send("ERROR :" + err.message);
  }
});

//POST API
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, password, emailId, age, gender, photo } =
      req.body;
    //Validation of data
    validation(req);
    //encrypt password
    console.log(password);

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      photo,
      password: passwordHash,
    }); //new instance of User
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
      expiresIn: "1h",
    }); // Secret Key
    res.cookie("token", token);
    await user.save(); //this is always to save
    res.json({ message: "Saved Success", data: user });
  } catch (err) {
    res.status(500).send("Not Saved" + err);
  }
});

//UPDATE API

authRouter.patch("/update/:userId", userAuth, async (req, res) => {
  const id = req.params?.userId;
  const data = req.body;

  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "password",
      "phoneNumber",
      "interests",
      "photo",
      "age",
      "gender",
    ];

    const userAllowedToUpdate = Object.keys(data).every((k) =>
      allowedFields.includes(k)
    );
    if (userAllowedToUpdate) {
      const user = await User.findByIdAndUpdate(id, data, {
        runValidators: true,
      });
      console.log(data);
      res.send("User Updated", user);
    } else {
      res.status(404).send("not allowed");
    }
  } catch (err) {
    res.status(500).send("Something went wrong" + err);
  }
});

// HW

authRouter.patch("/updateByEmailId", userAuth, async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;

  try {
    const users = await User.find({ emailId: emailId });

    if (users.length > 0) {
      const user = await User.findByIdAndUpdate(users[0]._id, data);
      res.send("user Updated");
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (err) {
    res.status(500).send("Something went wrong!!!");
  }
});

//DELETE API

authRouter.delete("/deleteById", userAuth, async (req, res) => {
  const id = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(id);
    res.send("User Deleted");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Success");
});

module.exports = { authRouter };
