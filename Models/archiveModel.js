const mongoose = require('mongoose');

const studentSchema = {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    father: { type: String, required: true },
    year: { type: Number, required: true },
    major: { type: Number, required: true }
};

const archiveSchema = {
    project_title: String,
    students: [studentSchema],
    doctor: String,
    guider: String,
    year: Number,
    date: { type: Number, default: null }
};
const Archive = mongoose.model("Archive", archiveSchema);

module.exports = Archive;