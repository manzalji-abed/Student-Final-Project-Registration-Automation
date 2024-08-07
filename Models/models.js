//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const doctor = require("./JS/doctors");
const edit = require("./JS/edit");
const report = require("./JS/reports");
const highStudy = require("./JS/highStudy");
const highStudyState = require("./JS/highStudyState");
const highStudyReport = require("./JS/highStudyReport");
const upload = require("express-fileupload");
const reader = require('xlsx');



const app = express();
app.use(upload())

app.use(bodyParser.urlencoded({ extended: true }));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/ITBaathDB');
}

const studentSchema = {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    father: { type: String, required: true },
    year: { type: Number, required: true },
    major: { type: Number, required: true }
};
const Student = mongoose.model("Student", studentSchema);


const projectSchema = {
    project_title: { type: String, required: true },
    students: [studentSchema],
    doctor: String,
    guider: String,
    year: Number
};
const Project = mongoose.model("Project", projectSchema);


const archiveSchema = {
    project_title: String,
    students: [Number],
    doctor: String,
    guider: String,
    year: Number,
    date: { type: Number, default: null }
};
const Archive = mongoose.model("Archive", archiveSchema);

const doctorSchema = {
    name: { type: String, required: true },
    major: { type: Number, required: true },
    maxFour: { type: Number, required: true },
    minFour: { type: Number, required: true },
    maxFive: { type: Number, required: true },
    minFive: { type: Number, required: true }
};
const Doctor = mongoose.model("Doctor", doctorSchema);

const engineerSchema = {
    name: { type: String, required: true },
    major: { type: Number, required: true },
    maxFour: { type: Number, required: true },
    minFour: { type: Number, required: true },
    maxFive: { type: Number, required: true },
    minFive: { type: Number, required: true }
};
const Engineer = mongoose.model("Engineer", engineerSchema);

const highStudySchema = {
    studentName: { type: String, required: true },
    studentID: { type: Number, required: true },
    specialization: { type: Number, required: true },
    level: { type: Number, required: true },
    supervisor: { type: String, required: true },
    arabicMessageTitle: { type: String, required: true },
    englishMessageTitle: { type: String, required: true },
    albaathDecisionNum: { type: Number, required: true },
    state: { type: String, required: true }

};
const HighStudy = mongoose.model("HighStudy", highStudySchema);



module.exports = mongoose.model('models', userSchema)