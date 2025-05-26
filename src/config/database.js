const url =
  "mongodb+srv://Cluster63134:aegN8tXOq97evFWl@cluster63134.gn3vv.mongodb.net/devTinder";

const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(url);
};

module.exports = { connectDb };
