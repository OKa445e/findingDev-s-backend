const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userauth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).send("Invalid Token");
    }
    const decodedObj = await jwt.verify(
      token,
      "f3b6a0e2a8f8caa2d11a6b8b14d1f9cc48e207fd5e9f9991c87e8f63cba221e5d901"
    );

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).send("User not Found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
};
module.exports = { userauth };
