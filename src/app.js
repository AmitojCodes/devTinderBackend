const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send(req.url);
});

app.use((req, res) => {
  res.send("Hello Amitoj");
});

app.listen(3000, () => {});
