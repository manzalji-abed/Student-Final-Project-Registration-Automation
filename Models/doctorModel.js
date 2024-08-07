const mongoose = require('mongoose');


const doctorSchema = {
    name: { type: String, required: true },
    major: { type: Number, required: true },
    maxFour: { type: Number, required: true },
    maxFive: { type: Number, required: true }
};
const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;