const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "http://localhost:5173/",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./router/authRouter.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/requests.js");
const userRouter = require("./router/userRouter.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


const PORT = 4000;
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
