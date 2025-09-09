const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userauth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Invalid Token");
    }
    const decodedObj = await jwt.verify(
      token,
      process.env.JWT_SECRET
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
