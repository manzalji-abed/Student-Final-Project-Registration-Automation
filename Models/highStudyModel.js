const mongoose = require('mongoose');

const highStudySchema = {
    studentName: { type: String, required: true },
    studentID: { type: Number, required: true },
    specialization: { type: Number, required: true },
    level: { type: Number, required: true },
    supervisor: { type: String, required: true },
    arabicMessageTitle: { type: String, required: true },
    englishMessageTitle: { type: String, required: true },
    albaathDecisionNum: { type: Number, required: true },
    date: { type: Date, required: true },
    state: { type: String, required: true }

};
const HighStudy = mongoose.model("HighStudy", highStudySchema);

module.exports = HighStudy;