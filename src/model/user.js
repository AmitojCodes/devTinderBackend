const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(v) {
        if (!validator.isEmail(v)) {
          throw new Error("Not a correct emailId");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(v) {
        if (!validator.isStrongPassword(v)) {
          throw new Error("Not a Strong Password");
        }
      },
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    interests: {
      type: [String],
    },
    photo: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      validate: {
        validator: function (v) {
          if (!["male", "female", "others"].includes(v)) {
            throw new Error("Not Valid");
          }
        },
      },
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1, lastName: 1 });

const User = mongoose.model("User", userSchema);

module.exports = { User };
