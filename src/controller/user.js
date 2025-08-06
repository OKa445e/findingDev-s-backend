const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userString = "name age photoUrl skills gender about";

const userRecievedRequests = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", userString);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
};

const userConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", userString)
      .populate("toUserId", userString);

    const data = connections.map((val) => {
      if (val.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return val.toUserId;
      } else {
        return val.fromUserId;
      }
    });
    return res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
};

const userFeed = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(userString)
      .skip(skip)
      .limit(limit);

    res.json({
      data: users,
    });
  } catch (err) {
    res.status(400).send("An error occurred: " + err.message);
  }
};

module.exports = { userRecievedRequests, userConnections, userFeed };
