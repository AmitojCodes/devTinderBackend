const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//Express router
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// app.post("/signup", async (req, res) => {
//   const user = new User({
//     firstName: "Amitoj",
//     lastName: "Singh",
//     emailId: "amitoj@singh",
//     password: "test1",
//   });

//   try {
//     await user.save();
//     res.send("Data Saved Success");
//   } catch {
//     res.status(500).send("Try again");
//   }
// });

connectDb()
  .then(() => {
    console.log("database Connceted");
    app.listen(3000, "0.0.0.0", () => () => {
      console.log("🚀 Server started and listening on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("database not connected");
  });

// const { auth } = require("./middlewares/auth");

// //ORDER

// // app.use("/user", (req, res) => {
// //     res.send("test");
// //   });

// // app.use("/user", auth);

// app.get("/user/:userId/:pass", auth, (req, res) => {
//   console.log(req.query); //QUERY PARAMS
//   console.log(req.params);
//   res.send({ name: req.params.userId, "phone number": "9999" });
// });

// app.get("/user", auth, (req, res) => {
//   console.log("hello");
//   res.send({ name: "Amitoj", "phone number": "9999" });
// });

// app.post("/user", (req, res) => {
//   res.send({ name: "Amitoj", "phone number": "9999" });
// });

// app.use("/test", (req, res) => {
//   ///for error testing
//   throw new error("dffg");
//   res.send("test");
// });

// app.get(
//   "/users",
//   (req, res, next) => {
//     console.log("1");
//     // res.send("1");
//     next();
//     // res.send("1");
//   },
//   (req, res, next) => {
//     console.log("2");
//     next();
//     // res.send("2");
//   },
//   (req, res, next) => {
//     console.log("3");
//     next();
//     res.send("3");
//   }
// );

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("something went wrong");
//   }
// });

// //.use will match app the api requests GET/POST
// // app.use("/", (req, res) => {
// //   res.send("Hello Amitoj");
// // });

// app.listen(3000, () => {});
