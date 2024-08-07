module.exports = {

    get: function(app, dic) {
        app.get("/archive", (req, res) => {
            res.sendFile(dic + "/HTML/archive.html");
        })
    },
    post: function(app) {
        let test;
        let resultForStudents;
        const Student = require('../Models/studentModel');
        const Doctor = require('../Models/doctorModel');
        const Archive = require('../Models/archiveModel');
        const Engineer = require('../Models/engineerModel');
        const Project = require('../Models/projectModel');
        app.post("/archive", async(req, res) => {
            let noobs = req.body.noobs;

            let q, allProjects, forDelete = [],
                n = noobs.length,
                errors = [],
                b = false;


            async function forSubmit() {
                for (let i = 0; i < n; i++) {

                    if (noobs[i] != '') {
                        try {
                            q = await Project.find({ students: { $elemMatch: { id: { $in: noobs } } } }).select("-_id").select("-__v")
                            if (!q.length) {
                                b = true
                                errors += "الطالب صاحب الرقم " + noobs[i] + " غير موجود في أي مشروع<br>"
                            } else {
                                forDelete.push(q[i])
                            }
                        } catch (error) { b = true }
                    }
                }
            }






            await forSubmit();

            if (errors.length) {
                test = false;
                resultForStudents = {
                    "errors": errors,
                }

            } else {
                test = true;
                resultForStudents = {
                    "forDelete": forDelete,
                    "noobs": noobs,
                    "errors": errors
                }
            }
            res.send();

            // خو الكود وعميل الفنكشن الاب async وضمن المكااااااتب 



        })

        app.post("/archiveConfirm", async(req, res) => {
            async function deletingNoobs() {
                try {
                    q = await Project.deleteMany({ students: { $elemMatch: { id: { $in: resultForStudents.noobs } } } })
                } catch (error) { b = true }
            }

            async function archieving() {
                try {
                    allProjects = await Project.find().select("-_id").select("-__v")
                    q = await Archive.insertMany(allProjects)
                    let nowDate = new Date();
                    let nowYear = nowDate.getFullYear();
                    q = await Archive.updateMany({ date: null }, { date: nowYear })
                } catch (error) { b = true }
            }

            async function deletingAllThing() {
                try {
                    q = await Project.deleteMany()
                    q = await Student.deleteMany()
                    q = await Doctor.deleteMany()
                    q = await Engineer.deleteMany()
                } catch (error) { b = true }
            }


            await deletingNoobs();
            await archieving();
            await deletingAllThing();
        })
        app.get("/archiveInfo", async(req, res) => {
            let obj = {
                "test": test,
                "resultForStudents": resultForStudents
            }
            res.json(obj)
        })

    }
}