const cron = require("node-cron");
const User = require("../models/User");
const JobLog = require("../models/JobLog");

// ==========================================
// JOB 1: DELETE STALE USERS
// ==========================================

const deleteStaleUsers = async () => {
    const jobName = "Delete Stale Users";

    try {
        console.log(`[${new Date().toISOString()}] ${jobName} started`);

        // Users inactive for more than 30 days
        const thirtyDaysAgo = new Date();

        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await User.deleteMany({
            lastActive: {
                $lt: thirtyDaysAgo
            }
        });

        await JobLog.create({
            jobName,
            status: "SUCCESS",
            message: "Stale users deleted successfully",
            recordsAffected: result.deletedCount
        });

        console.log(
            `${jobName} completed. Deleted: ${result.deletedCount}`
        );

    } catch (error) {

        console.error(`${jobName} failed:`, error.message);

        await JobLog.create({
            jobName,
            status: "FAILED",
            message: error.message,
            recordsAffected: 0
        });
    }
};


// ==========================================
// JOB 2: DAILY SUMMARY
// ==========================================

const dailySummary = async () => {
    const jobName = "Daily Summary";

    try {
        console.log(`[${new Date().toISOString()}] ${jobName} started`);

        const totalUsers = await User.countDocuments();

        await JobLog.create({
            jobName,
            status: "SUCCESS",
            message: `Daily summary generated. Total users: ${totalUsers}`,
            recordsAffected: totalUsers
        });

        console.log(
            `${jobName} completed. Total users: ${totalUsers}`
        );

    } catch (error) {

        console.error(`${jobName} failed:`, error.message);

        await JobLog.create({
            jobName,
            status: "FAILED",
            message: error.message,
            recordsAffected: 0
        });
    }
};


// ==========================================
// CRON SCHEDULES
// ==========================================

// Every day at midnight
cron.schedule("0 0 * * *", async () => {
    await deleteStaleUsers();
});


// Every day at 9 AM
cron.schedule("0 9 * * *", async () => {
    await dailySummary();
});


console.log("Scheduled jobs initialized");


// Export functions for manual execution
module.exports = {
    deleteStaleUsers,
    dailySummary
};