const User = require("../models/user.js");
const { validateSignupData } = require("../utils/validation.js");
const bcrypt = require("bcryptjs");

const signupAuth =  async (req, res) => {
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
}

const loginAuth = async (req, res) => {
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
}

const logoutAuth = async(req,res) => {
   res.cookie("token",null,{
    expires: new Date (Date.now()),
   })
   .send("Logout Successfully");
}

module.exports = {signupAuth,loginAuth,logoutAuth};