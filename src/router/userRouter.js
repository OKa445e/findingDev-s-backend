const express = require('express');
const { userauth } = require('../middleware/auth');
const { userRecievedRequests, userConnections, userFeed } = require('../controller/user');

const userRouter = express.Router();

userRouter.get("/user/request/received",userauth,userRecievedRequests);

userRouter.get("/user/connections",userauth,userConnections);

userRouter.get("/user/feed",userauth,userFeed);

module.exports = userRouter;