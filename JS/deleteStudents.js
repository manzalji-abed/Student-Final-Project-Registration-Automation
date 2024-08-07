module.exports = {

    get: function(app, dic) {
        app.get("/deleteStudents", (req, res) => {
            res.sendFile(dic + "/HTML/deleteStudents.html");
        })
    },
    post: function(app) {
        let test = true;
        let resultForStudents;
        const Project = require('../Models/projectModel');
        app.post("/deleteStudents", async(req, res) => {
            let data = req.body;
            let b = false,
                exist = false,
                errors = [],
                q, oldInfo;


            async function checkIfExist() {
                try {
                    q = await Project.find({ students: { $elemMatch: { id: data.studentID } } }).select("-_id").select("-__v")

                    if (q.length) {
                        oldInfo = q[0];
                        exist = true;
                    }
                } catch (error) {
                    b = true;
                }
            }

            async function deleting() {
                try {
                    q = await Project.deleteOne({ students: { $elemMatch: { id: data.studentID } } })


                } catch (error) {
                    b = true;
                }


            }

            if (data.studentID == '') {
                errors += "أدخل رقم الطالب<br>"

            } else {
                await checkIfExist();
                if (!exist) {
                    errors += "المشروع غير موجود<br>";
                }
            }

            if (errors.length > 0) {
                test = false;
                resultForStudents = {
                    "errors": errors
                }
            } else {
                test = true;
                resultForStudents = {
                        "oldInfo": oldInfo,
                        "studentID": data.studentID
                    }
                    // res.send(oldInfo)

                // await deleting();

            }


            res.send();

            // هوووون وضمن المكاااتب  ولا تنسى الاسينك



        })

        app.post("/deleteConfirm", async(req, res) => {
            try {
                q = await Project.deleteOne({ students: { $elemMatch: { id: resultForStudents.studentID } } })


            } catch (error) {
                b = true;
            }
        })
        app.get("/deleteInfo", async(req, res) => {
            let obj = {
                "test": test,
                "resultForStudents": resultForStudents
            }
            res.json(obj)
        })
    }
}