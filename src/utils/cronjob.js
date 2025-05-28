const cron = require("node-cron");

const { subDays, endOfDay, startOfDay } = require("date-fns");
const { ConnectionRequestModel } = require("../model/connectionRequest");

cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const res = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).popluate("toUserId, fromUserId");

    const requestedEmails = [...new Set(res.map((r) => r.toUserId.emailId))];

    for (const email of requestedEmails) {
      try {
        // const res = await sendEmail.run("heading", email, "body");
      } catch (err) {}
    }
  } catch (err) {
   console.log(err.message);
  }
});
