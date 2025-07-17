const User = require("../models/user.js");
const ConnectionRequest = require("../models/connectionRequest.js");

const profileRequest = async (req, res) => {
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
     message:  actionMessage,
     data
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { profileRequest };
