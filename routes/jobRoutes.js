const express = require("express");

const {
    getJobs,
    getJobLogs,
    runCleanupJob,
    runDailySummary
} = require("../controllers/jobController");

const router = express.Router();


// List scheduled jobs
router.get("/", getJobs);


// View execution logs
router.get("/logs", getJobLogs);


// Manually execute cleanup job
router.post("/cleanup/run", runCleanupJob);


// Manually execute daily summary
router.post("/daily-summary/run", runDailySummary);


module.exports = router;