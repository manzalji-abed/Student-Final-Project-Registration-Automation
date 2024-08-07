const mongoose = require('mongoose');

const studentSchema = {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    father: { type: String, required: true },
    year: { type: Number, required: true },
    major: { type: Number, required: true }
};

const projectSchema = {
    project_title: { type: String, required: true },
    students: [studentSchema],
    doctor: String,
    guider: String,
    year: Number
};
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;