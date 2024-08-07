const read = require('body-parser/lib/read');

module.exports = {

    get: function(app, dic) {
        app.get("/query", (req, res) => {
            res.sendFile(dic + "/HTML/query.html");

        })

        app.get("/query1", async(req, res) => {
            res.sendFile(dic + "/HTML/testForJson.html");

        })

    },
    post: function(app) {
        let result = [];
        app.post("/query", async(req, res) => {
            result = [];
            const Student = require('../Models/studentModel');
            const Archive = require('../Models/archiveModel');
            const Project = require('../Models/projectModel');
            let reports = req.body
                // reports = Object.fromEntries(reports);
            let b = false;

            //طلب المشاريع التابعة لدكتور
            async function doctorQuery(doc, year) {
                try {
                    q = await Project.find({ doctor: doc, year: { $in: year } }).select("-_id").select("-__v")
                    result.push([{ doctor: doc, year: year }, q])
                } catch (error) {

                    b = true
                }
            }

            //لمشرف
            async function engineerQuery(guid, year) {
                try {
                    q = await Project.find({ guider: guid, year: { $in: year } }).select("-_id").select("-__v")
                    result.push([{ guider: guid, year: year }, q])
                } catch (error) {

                    b = true
                }
            }

            //لسنة دراسية
            async function yearQuery(year, specialization) {
                try {
                    q = await Project.find({ year: { $in: year }, major: { $in: specialization } }).select("-_id").select("-__v")
                    result.push([{ year: year, major: specialization }, q])
                } catch (error) {

                    b = true
                }
            }

            //لسنة من الارشيف
            async function yearArchieveQuery(year) {
                try {
                    q = await Archive.find({ date: year }).select("-_id").select("-__v")
                    result.push([{ date: year }, q])
                } catch (error) {

                    b = true
                }
            }

            //طلب معلومات طالب ما
            async function studentQuery(studentID) {
                try {
                    q = await Student.find({ id: studentID }).select("-_id").select("-__v")
                    result.push(q)
                } catch (error) {

                    b = true
                }
            }

            //طلب المشروع اللي بيحوي طالب معين
            async function projectQuery(studentID) {
                try {
                    q = await Project.find({ students: { $elemMatch: { id: studentID } } }).select("-_id").select("-__v")
                    result.push([{ students: studentID }, q])
                } catch (error) {

                    b = true
                }
            }

            //طلب معلومات كل الطلاب
            async function allStudentQuery() {
                try {
                    q = await Student.find().select("-_id").select("-__v")
                    return q;
                } catch (error) {

                    b = true
                }
            }
            //طلب معلومات الطلاب غير المسجلين
            async function allStudentNotSignQuery() {
                try {
                    let a = await allStudentQuery();
                    q = [];
                    let n = a.length;
                    for (let i = 0; i < n; i++) {
                        let p = await Project.find({ students: { $elemMatch: { id: a[i].id } } }).select("-_id").select("-__v")
                        if (!p.length) q.push(a[i])
                    }
                    result.push([{ state: "unsigned" }, q])
                } catch (error) {
                    b = true
                }
            }

            //طلب معلومات الطلاب المسجلين
            async function allStudentSignQuery() {
                try {
                    let a = await allStudentQuery();
                    q = [];
                    let n = a.length;
                    for (let i = 0; i < n; i++) {
                        try {
                            let p = await Project.find({ students: { $elemMatch: { id: a[i].id } } }).select("-_id").select("-__v")
                            if (p.length) q.push(a[i])
                        } catch (error) {
                            b = true
                        }
                    }
                    result.push([{ state: "signed" }, q])
                } catch (error) {

                    b = true
                }
            }

            for (let i = 0; i < reports.doctorReports.length; i++) {
                if (reports.doctorReports[i] == "") break;
                if (reports.doctorYear[i] == "") reports.doctorYear[i] = [4, 5];
                await doctorQuery(reports.doctorReports[i], reports.doctorYear[i]);
            }
            for (let i = 0; i < reports.engReports.length; i++) {
                if (reports.engReports[i] == "") break;
                if (reports.engYear[i] == "") reports.engYear[i] = [4, 5];
                await engineerQuery(reports.engReports[i], reports.engYear[i]);
            }
            for (let i = 0; i < reports.yearReport.length; i++) {
                if (reports.yearReport[i] == "" && reports.specializationReport[i] == "") break;
                if (reports.yearReport[i] == "") reports.yearReport[i] = [4, 5]
                if (reports.specializationReport[i] == "") reports.specializationReport[i] = [1, 2]
                await yearQuery(reports.yearReport[i], reports.specializationReport[i]);
            }
            for (let i = 0; i < reports.studentReports.length; i++) {
                if (reports.studentReports[i] == "") break;
                await projectQuery(reports.studentReports[i]);
            }
            for (let i = 0; i < reports.dateReports.length; i++) {
                if (reports.dateReports[i] == "") break;
                await yearArchieveQuery(reports.dateReports[i].slice(reports.dateReports[i].length - 4));
            }
            for (let i = 0; i < reports.studentsState.length; i++) {
                if (reports.studentsState[i] == "") break;
                if (reports.studentsState[i] == "all") result.push([{ state: "all" }, await allStudentQuery()]);
                else if (reports.studentsState[i] == "unsigned") await allStudentNotSignQuery();
                else if (reports.studentsState[i] == "signed") await allStudentSignQuery();
            }

            res.send();



        })

        app.get("/query12", async(req, res) => {
            res.json(result);

        })




    }
}