const express = require('express');
const {userauth} = require("../middleware/auth");
const {profileRequest} = require("../controller/requestController");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userauth,profileRequest)


module.exports = requestRouter;