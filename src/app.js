const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("./middleware/googleAuth.js");
const session  = require("express-session");
const dotenv = require("dotenv");
require("./utils/cronjobs.js");
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/",(req,res)=>{
  res.send("Backend is ruunning");
})
const authRouter = require("./router/authRouter.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/requests.js");
const userRouter = require("./router/userRouter.js");
const paymentRouter = require("./router/payment.js");

app.use("/auth", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/",paymentRouter);


const PORT = process.env.PORT;

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
