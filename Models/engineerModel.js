const mongoose = require('mongoose');

const engineerSchema = {
    name: { type: String, required: true },
    major: { type: Number, required: true },
    maxFour: { type: Number, required: true },
    maxFive: { type: Number, required: true }
};
const Engineer = mongoose.model("Engineer", engineerSchema);

module.exports = Engineer;