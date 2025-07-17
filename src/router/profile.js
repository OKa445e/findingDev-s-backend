const express = require('express');
const { userProfile, userProfileEdit,userProfilePassword } = require('../controller/profileController');
const { userauth } = require("../middleware/auth.js");

const profileRouter = express.Router();


profileRouter.get("/profile/view", userauth,userProfile);

profileRouter.patch("/profile/edit",userauth,userProfileEdit);

profileRouter.patch("/profile/changepassword",userauth,userProfilePassword)




module.exports = profileRouter;