const jwt = require("jsonwebtoken");
const { User } = require("../model/user");
const auth = (req, res, next) => {
  console.log("1");
  const token = "hello";
  const isAuthenticated = token === "hello";
  if (!isAuthenticated) {
    res.status(401).send("Not Authenticated");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).send("Not FOund");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { auth, userAuth };
