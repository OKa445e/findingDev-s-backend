const express = require('express');
const { userProfile, userProfileEdit,userProfilePassword } = require('../controller/profileController');
const { userauth } = require("../middleware/auth.js");
const upload = require("../middleware/upload");

const profileRouter = express.Router();


profileRouter.get("/profile/view", userauth,userProfile);

profileRouter.patch("/profile/edit", userauth, upload.single("photo"), userProfileEdit);

profileRouter.patch("/profile/changepassword",userauth,userProfilePassword)




module.exports = profileRouter;