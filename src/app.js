const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./router/authRouter.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/requests.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
