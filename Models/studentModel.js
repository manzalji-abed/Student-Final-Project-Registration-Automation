const mongoose = require('mongoose');

const studentSchema = {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    father: { type: String, required: true },
    year: { type: Number, required: true },
    major: { type: Number, required: true }
};
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;