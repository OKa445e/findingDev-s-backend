const User = require("../models/user.js");
const ConnectionRequest = require("../models/connectionRequest.js");

const profileSender = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type: " + status,
      });
    }

    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res.status(400).send("Connection request already exists");
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    let actionMessage = "";
    if (status === "interested") {
      actionMessage = `Connection request sent to ${toUser.name}`;
    } else if (status === "ignored") {
      actionMessage = `You ignored ${toUser.name}'s profile`;
    }

    return res.json({
      message: actionMessage,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

const profileReceiver = async(req,res) => {
   try{
    const loggedInUser = req.user;
    const {status,requestId} = req.params;

    const allowedStatus = ["accepted","rejected"];

    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: "Invalid status type " + status
      })
    };

    const connectionRequest = await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status: "interested"
    });
    if(!connectionRequest){
      return res.status(400).json({
        message: "Invalid connection request"
      })
    };

    const sender = await User.findById(connectionRequest.fromUserId);

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    
    let actionMessage = "";
    if (status === "accepted") {
      actionMessage = `You accepted the connection request from user ${sender?.name}`;
    } else {
      actionMessage = `You rejected the connection request from user ${sender?.name}`;
    }

    return res.json({
      message: actionMessage,
      data,
    });

   }catch(err) {
    res.status(400).send("An error occurred: " + err.message);
  }
}


module.exports = { profileSender, profileReceiver };
