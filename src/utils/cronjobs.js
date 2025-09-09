const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const connectionRequestModal = require("../models/connectionRequest");

cron.schedule("24 15 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequest = await connectionRequestModal
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lte: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");

    const listOfEmail = [
      ...new Set(pendingRequest.map((req) => req.toUserId.emailId)),
    ];

    console.log(listOfEmail);
    for (const email of listOfEmail) {
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending for " + email,
          "There are many request pending"
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
