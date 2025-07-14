const express = require("express");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { validateSignupData } = require("./utils/validation.js");

const app = express();
app.use(express.json());

// ✅ Signup Route
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

// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send("Invalid credentials");
    }

    res.status(200).send("Login Successful");
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
});

// ✅ Get User by Email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      return res.status(400).send("User doesn't exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
});

// ✅ Get All Users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(400).send("No users found");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
});

// ✅ Get by ID
app.get("/getbyid/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
});

// ✅ Delete User by ID
app.delete("/deletebyid/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(400).send("User not found");
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
});

// ✅ Update User by ID
app.patch("/updatebyid/:id", async (req, res) => {
  const ALLOWED_UPDATES = ["photoUrl", "skills", "about", "password"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((key) => ALLOWED_UPDATES.includes(key));

  if (!isValidUpdate) {
    return res.status(400).send("Invalid update fields");
  }

  if (req.body.skills && req.body.skills.length > 15) {
    return res.status(400).send("Skills cannot be more than 15");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!updatedUser) {
      return res.status(400).send("User not found");
    }

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
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
