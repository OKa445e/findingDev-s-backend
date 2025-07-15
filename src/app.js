const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { validateSignupData } = require("./utils/validation.js");
const { userauth } = require("./middleware/auth.js");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    await validateSignupData(req);

    const { name, emailId, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("Email is already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      emailId,
      password: hashPassword,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid credentials");
    }
    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 3600000),
    });
    res.status(200).send("Login Successful");
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
});

app.get("/profile", userauth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
});

app.get("/connectionRequest", userauth, async (req, res) => {
  const user = req.user;
  try {
    res.send(user.name + " " + "sent the connection request");
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
});

// ✅ Start Server
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
