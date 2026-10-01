const mongoose = require("mongoose");

const jobLogSchema = new mongoose.Schema(
    {
        jobName: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["SUCCESS", "FAILED"],
            required: true
        },

        message: {
            type: String
        },

        recordsAffected: {
            type: Number,
            default: 0
        },

        executedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("JobLog", jobLogSchema);