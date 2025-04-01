const cron = require("node-cron");
const Subscription = require("../../model/Subscription/SubscriptionsModel");
const User = require("../../model/User/UserManagementModal");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("Checking for expiring subscriptions...");

    const now = new Date();
    const tenDaysLater = new Date();
    tenDaysLater.setDate(now.getDate() + 10);

    try {
        const expiringSubscriptions = await Subscription.find({
            endDate: { $lte: tenDaysLater, $gte: now },
            status: "Active",
        }).populate("user package");

        // for (const sub of expiringSubscriptions) {
        //     await sendExpiryEmail(sub.user.email, sub.package.packageName, sub.endDate);
        // }

        console.log(`Notified ${expiringSubscriptions.length} users about expiry.`);
    } catch (error) {
        console.error("Error checking subscriptions:", error);
    }
});

cron.schedule("0 1 * * *", async () => {
    console.log("Checking for expired subscriptions...");
  
    const now = new Date();
  
    try {
      await Subscription.updateMany(
        { endDate: { $lt: now }, status: "Active" },
        { status: "Expired" }
      );
  
      console.log("Expired old subscriptions.");
    } catch (error) {
      console.error("Error expiring subscriptions:", error);
    }
  });