const express = require('express');
const {userauth} = require("../middleware/auth");
const {profileSender, profileReceiver} = require("../controller/requestController");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userauth, profileSender);


requestRouter.post("/request/review/:status/:requestId", userauth,profileReceiver);



module.exports = requestRouter;