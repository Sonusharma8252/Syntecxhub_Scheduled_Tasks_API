require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

// Initialize scheduled jobs
require("./jobs/scheduledJobs");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// ROUTES
// ==========================================

const jobRoutes = require("./routes/jobRoutes");

app.use("/api/jobs", jobRoutes);


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Scheduled Tasks API is running"
    });

});


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});