const express = require("express");
const paymentRouter = express.Router();

paymentRouter.post("createOrder", userAuth, async (req, res) => {
  try {
    // const res = await

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = paymentRouter;
