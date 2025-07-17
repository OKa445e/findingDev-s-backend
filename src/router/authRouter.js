const express = require('express');
const { signupAuth, loginAuth, profileAuth, logoutAuth } = require('../controller/authController');
const { userauth } = require("../middleware/auth");



const authRouter = express.Router();

authRouter.post("/signup",signupAuth);

authRouter.post("/login",loginAuth);

authRouter.post("/logout",logoutAuth);






module.exports = authRouter;