//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const upload = require("express-fileupload");
const com = require("string-comparison")
require("dotenv/config");


//Models
const Student = require('./Models/studentModel');
const Doctor = require('./Models/doctorModel');
const Archive = require('./Models/archiveModel');
const Engineer = require('./Models/engineerModel');
const Project = require('./Models/projectModel');

//API
const update = require("./JS/update");
const updateDoc = require("./JS/updateDoctors");
const archive = require("./JS/archive");
const files = require("./JS/files");
const doctor = require("./JS/doctors");
const query = require("./JS/query");
const deleteStudents = require("./JS/deleteStudents");
const deleteHighStudy = require("./JS/deleteHighStudy");
const report = require("./JS/reports");
const deleteDoctors = require("./JS/deleteDoctors");
const highStudy = require("./JS/highStudy");
const updateHighStudy = require("./JS/updateHighStudy");
const successPage = require("./JS/successPage");



async function main() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION);
    } catch (error) { console.log("error") }
}
main();

const app = express();

app.use(express.static('public'))
app.use(upload())

app.use(bodyParser.urlencoded({ extended: true }));
updateHighStudy.get(app, __dirname);
updateHighStudy.post(app);

successPage.get(app, __dirname);

highStudy.get(app, __dirname);
highStudy.post(app, __dirname);
deleteDoctors.get(app, __dirname);
deleteDoctors.post(app);
query.get(app, __dirname);
query.post(app);
deleteHighStudy.get(app, __dirname);
deleteHighStudy.post(app);
deleteStudents.get(app, __dirname);
deleteStudents.post(app);
update.get(app, __dirname);
update.post(app);
updateDoc.get(app, __dirname);
updateDoc.post(app);
archive.get(app, __dirname);
archive.post(app);
files.get(app, __dirname);
files.post(app, __dirname);
doctor.get(app, __dirname);
doctor.post(app);
let test1 = true;
let projectName = ""
let doctorName = ""
let supervisor = ""
let resultForStudents;
minProject = 4;
maxProject = 5;
app.get("/successPage", (req, res) => {
    res.sendFile(__dirname + "/HTML/successPage.html");
})
app.get("/deletePage", (req, res) => {
    res.sendFile(__dirname + "/HTML/success_delete.html");
})
app.get("/students", (req, res) => {
    res.sendFile(__dirname + "/HTML/students.html");
})
app.get("/result", async(req, res) => {
    let obj = { "Doctor": await Doctor.find().select("-_id").select("-__v"), "Engineer": await Engineer.find().select("-_id").select("-__v"), "test": test1, "resultForStudents": resultForStudents };
    res.json(obj);
})
app.post("/confirm", async(req, res) => {
    try { const q = await Project.insertMany(resultForStudents.forSubmit); } catch (error) {
        b = true;
    }
})
app.post("/students", async(req, res) => {

    let data = req.body;
    let numberError = false;
    const map = new Map();


    projectName = data.projectName;
    doctorName = data.doctor;
    supervisor = data.supervisor;
    yeaar = data.year;


    let studentIds = [];
    let freq = false;
    let net = 0,
        pro = 0;
    for (let i = 0; i <= maxProject; i += 1) {
        let studentID;
        if (data.studentID[i]) {
            studentID = Number(data.studentID[i]);
            if (studentIds.includes(studentID))
                freq = true;
            else
                studentIds.push(studentID);
        }
    }


    let majorType = 0;

    if (pro > net)
        majorType = 1;
    else if (net > pro)
        majorType = 2;


    size = studentIds.length;


    if (size > maxProject || size < minProject)
        numberError = true;

    var errors = [],
        studentsInfo = [],
        majors = [
            [],
            [],
            []
        ],
        similarProjects = [],
        similarOldProjects = [],
        b = false,
        notFound = false;

    async function condition() {
        let docMajor = 1,
            docMax = 5,
            docMin = 3,
            engMajor = 1,
            engMax = 5,
            engMin = 3,
            q;

        try {
            q = await Doctor.find({ name: doctorName }).select("-_id").select("-__v")
            if (q.length) docMajor = q[0].major;
            if (yeaar == 4) {
                docMax = q[0].maxFour;
                docMin = q[0].minFour;
            } else {
                docMax = q[0].maxFive;
                docMin = q[0].minfive;
            }

            q = await Engineer.find({ name: supervisor }).select("-_id").select("-__v")
            if (q.length) engMajor = q[0].major;
            if (yeaar == 4) {
                engMax = q[0].maxFour;
                engMin = q[0].minFour;
            } else {
                engMax = q[0].maxFive;
                engMin = q[0].minfive;
            }

            let sim = ["موقع", "التطبيق", "الكترونية", "إلكترونية", "الكتروني", "إلكتروني", "خدمات", "خدمة", "تصميم", "ويب"]


            q = await Project.find().select("-_id").select("-__v")
            for (let i = 0; i < q.length; i++) {
                let similarityRate = []
                let temptitle = projectName
                let tempco1 = q[i].project_title

                for (let j = 0; j < sim.length; j++) {
                    temptitle = temptitle.replace("ال" + sim[j], "")
                    tempco1 = tempco1.replace("ال" + sim[j], "")
                }
                for (let j = 0; j < sim.length; j++) {
                    temptitle = temptitle.replace("ل" + sim[j], "")
                    tempco1 = tempco1.replace("ل" + sim[j], "")
                }
                for (let j = 0; j < sim.length; j++) {
                    temptitle = temptitle.replace(sim[j], "")
                    tempco1 = tempco1.replace(sim[j], "")
                }

                similarityRate.push(com.lcs.similarity(temptitle, tempco1))
                similarityRate.push(com.mlcs.similarity(temptitle, tempco1))
                    // similarityRate.push(com.diceCoefficient.similarity(temptitle, tempco1))
                similarityRate.push(com.cosine.similarity(temptitle, tempco1))
                similarityRate.push(com.jaccardIndex.similarity(temptitle, tempco1))
                if ((similarityRate[0] + similarityRate[1] + similarityRate[2] + similarityRate[3]) / 4 > 0.5) similarProjects.push(q[i].project_title)

            }

            q = await Archive.find().select("-_id").select("-__v")
            for (let i = 0; i < q.length; i++) {
                let similarityRate = []
                let temptitle = projectName
                let tempco1 = q[i].project_title

                for (let j = 0; j < sim.length; j++) {
                    temptitle = temptitle.replace("ال" + sim[j], "")
                    tempco1 = tempco1.replace("ال" + sim[j], "")
                }
                for (let j = 0; j < sim.length; j++) {
                    temptitle = temptitle.replace("ل" + sim[j], "")
                    tempco1 = tempco1.replace("ل" + sim[j], "")
                }
                for (let j = 0; j < sim.length; j++) {
                    temptitle = temptitle.replace(sim[j], "")
                    tempco1 = tempco1.replace(sim[j], "")
                }

                similarityRate.push(com.lcs.similarity(temptitle, tempco1))
                similarityRate.push(com.mlcs.similarity(temptitle, tempco1))
                    // similarityRate.push(com.diceCoefficient.similarity(temptitle, tempco1))
                similarityRate.push(com.cosine.similarity(temptitle, tempco1))
                similarityRate.push(com.jaccardIndex.similarity(temptitle, tempco1))
                if ((similarityRate[0] + similarityRate[1] + similarityRate[2] + similarityRate[3]) / 4 > 0.5) similarOldProjects.push(q[i].project_title)

            }

            q = await Project.find({ doctor: doctorName, year: yeaar }).select("-_id").select("-__v")
            if (q.length >= docMax) errors.push("الدكتور " + doctorName + " لم تعد لديه شواغر<br>");

            q = await Project.find({ guider: supervisor, year: yeaar }).select("-_id").select("-__v")
            if (q.length >= engMax) errors.push("المهندس " + supervisor + " لم تعد لديه شواغر<br>");
        } catch (error) {
            b = true;
        }
        let n = studentIds.length
        for (let i = 0; i < n; i++) {
            try {
                si = await Student.find({ id: studentIds[i] }).select("-_id").select("-__v")
                if (si.length) {
                    studentsInfo.push(si[0])
                    majors[si[0].major - 1].push(si[0].name)

                    q = await Project.find({ students: { $elemMatch: { id: si[0].id } }, year: yeaar }).select("-_id").select("-__v")
                    if (q.length) errors.push("الطالب " + si[0].name + " مشترك في مشروع اّخر<br>");

                    q = await Archive.find({ students: { $elemMatch: { id: si[0].id } }, year: yeaar }).select("-_id").select("-__v")
                    if (q.length) errors.push("الطالب " + si[0].name + " قد قدم المشروع بالفعل في السنوات السابقة<br>");

                    if (si[0].year != yeaar) errors.push("الطالب " + si[0].name + " في سنة أخرى<br>");
                } else {
                    notFound = true;
                    errors.push("الطالب صاحب الرقم " + studentIds[i] + " غير موجود<br>")
                }
            } catch (error) {
                b = true;
            }
        }
        let m = ["برمجيات", "شبكات", "ذكاء"]
        if (!notFound && majors[docMajor - 1].length < studentsInfo.length / 2) {
            errors.push("عدد الطلاب من خارج قسم ال" + m[docMajor - 1] + " هو " + (studentsInfo.length - majors[docMajor - 1].length) + " يفوق عدد طلاب ال" + m[docMajor - 1] + " وهو " + (majors[docMajor - 1].length) + " والمشروع تابع لل" + m[docMajor - 1] + "<br>")
        }
        if (docMajor != engMajor) errors.push("المهندس يجب أن يكون من نفس اختصاص الدكتور<br>")
    }

    async function insert() {
        if (!errors.length && !b && !numberError && !freq) {
            const rec = new Project({ project_title: projectName, students: studentsInfo, doctor: doctorName, guider: supervisor, year: yeaar });
            try { const q = await Project.insertMany(rec); } catch (error) {
                b = true;
            }
        }
    }

    await condition();
    // await insert();
    let s = "";
    for (let i = 0; i < errors.length; i++) {
        s += errors[i];
    }
    if (freq)
        s += "هناك طلاب مكررين<br>";
    if (numberError)
        s += "عدد الطلاب غير مقبول (لا يتم احتساب التكرارات والإدخالات الفارغة)<br>";

    if (!errors.length && !b && !numberError && !freq && s == "") {
        test1 = true;
        const forSubmit = new Project({ project_title: projectName, students: studentsInfo, doctor: doctorName, guider: supervisor, year: yeaar });
        resultForStudents = {
            "similarOldProjects": similarOldProjects,
            "similarProjects": similarProjects,
            "forSubmit": forSubmit,
            "errors": s
        };
    } else {
        test1 = false;
        const forSubmit = new Project({ project_title: projectName, students: studentsInfo, doctor: doctorName, guider: supervisor, year: yeaar });
        resultForStudents = {
            "similarOldProjects": similarOldProjects,
            "similarProjects": similarProjects,
            "forSubmit": forSubmit,
            "errors": s
        };
    }
    res.send();
})

report.get(app, __dirname);
report.post(app);

app.listen(3002, () => {
    console.log("Server Started !!");
})