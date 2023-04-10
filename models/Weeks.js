const mongoose = require("mongoose");

const weeksSchema = new mongoose.Schema(
    {
        title: { type: String },
        week: { type: String, required: true },
        headline: { type: String, required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

const Week = mongoose.model("Week", weeksSchema);
module.exports = Week;
