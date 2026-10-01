const JobLog = require("../models/JobLog");

const {
    deleteStaleUsers,
    dailySummary
} = require("../jobs/scheduledJobs");


// ==========================================
// GET ALL SCHEDULED JOBS
// ==========================================

const getJobs = async (req, res) => {

    try {

        const jobs = [
            {
                name: "Delete Stale Users",
                schedule: "0 0 * * *",
                description: "Deletes users inactive for more than 30 days",
                status: "active"
            },
            {
                name: "Daily Summary",
                schedule: "0 9 * * *",
                description: "Generates daily user summary",
                status: "active"
            }
        ];

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to get scheduled jobs",
            error: error.message
        });
    }
};


// ==========================================
// GET JOB EXECUTION LOGS
// ==========================================

const getJobLogs = async (req, res) => {

    try {

        const logs = await JobLog
            .find()
            .sort({ executedAt: -1 });

        res.status(200).json({
            success: true,
            count: logs.length,
            logs
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to get job logs",
            error: error.message
        });
    }
};


// ==========================================
// MANUALLY RUN CLEANUP JOB
// ==========================================

const runCleanupJob = async (req, res) => {

    try {

        await deleteStaleUsers();

        res.status(200).json({
            success: true,
            message: "Cleanup job executed successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Cleanup job failed",
            error: error.message
        });
    }
};


// ==========================================
// MANUALLY RUN DAILY SUMMARY
// ==========================================

const runDailySummary = async (req, res) => {

    try {

        await dailySummary();

        res.status(200).json({
            success: true,
            message: "Daily summary job executed successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Daily summary job failed",
            error: error.message
        });
    }
};


module.exports = {
    getJobs,
    getJobLogs,
    runCleanupJob,
    runDailySummary
};