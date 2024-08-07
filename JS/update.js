const Project = require("../Models/projectModel");

module.exports = {

    get: function(app, dic) {
        app.get("/updateStudents", (req, res) => {
            res.sendFile(dic + "/HTML/updateStudents.html");

        })
    },
    post: function(app) {
        let test2;
        let resultForStudents;
        app.post("/updateStudents", async(req, res) => {
            const edit = require("./edit");
            const Student = require('../Models/studentModel');
            const Doctor = require('../Models/doctorModel');
            const Archive = require('../Models/archiveModel');
            const Engineer = require('../Models/engineerModel');
            const Project = require('../Models/projectModel');
            const com = require("string-comparison")


            let newStudents = edit.editor(req.body);

            var errors = [],
                b = false,
                breakall = false,
                numberError = false,
                minProjext = 4,
                maxProject = 5;

            let q, nowTitle, nowDoc, nowEng, nowYear, nowStudentsIds = [],
                similarProjects = [],
                similarOldProjects = [],
                oldProject,
                oldStudents = [];

            let docMajor = 1,
                docMax = 30,
                docMin = 0,
                engMajor = 1,
                engMax = 30,
                engMin = 0;
            let n,
                nowStudents = [],
                majors = [
                    [],
                    [],
                    []
                ],
                notFound = false;

            async function condition() {


                try {
                    q = await Student.find({ id: newStudents.editorId }).select("-_id").select("-__v")
                    if (!q.length) {
                        errors.push("لا يوجد طالب يحمل الرقم الجامعي " + newStudents.editorId + "<br>");
                        breakall = true;
                        return;
                    } else {
                        q = await Project.find({ students: { $elemMatch: { id: newStudents.editorId } } }).select("-_id").select("-__v")
                        if (!q.length) {
                            errors.push("الطالب صاحب الرقم " + newStudents.editorId + " غير موجود في اي مشروع<br>");
                            breakall = true;
                            return;
                        } else {
                            oldProject = q[0]
                            nowTitle = (newStudents.projectName) ? newStudents.projectName : q[0].project_title;
                            nowDoc = (newStudents.doctorName) ? newStudents.doctorName : q[0].doctor;
                            nowEng = (newStudents.supervisor) ? newStudents.supervisor : q[0].guider;
                            nowYear = (newStudents.year) ? newStudents.year : q[0].year;
                            nowStudentsIds = newStudents.newStudents;
                            oldStudents = q[0].students;
                        }
                    }





                    q = await Doctor.find({ name: nowDoc }).select("-_id").select("-__v")
                    if (q.length) docMajor = q[0].major;
                    if (nowYear == 4) {
                        docMax = q[0].maxFour;
                        docMin = q[0].minFour;
                    } else {
                        docMax = q[0].maxFive;
                        docMin = q[0].minfive;
                    }

                    q = await Engineer.find({ name: nowEng }).select("-_id").select("-__v")
                    if (q.length) engMajor = q[0].major;
                    if (nowYear == 4) {
                        engMax = q[0].maxFour;
                        engMin = q[0].minFour;
                    } else {
                        engMax = q[0].maxFive;
                        engMin = q[0].minfive;
                    }

                    let sim = ["موقع", "التطبيق", "الكترونية", "إلكترونية", "الكتروني", "إلكتروني", "خدمات", "خدمة", "تصميم", "ويب"]





                    q = await Project.find({ students: { $not: { $elemMatch: { id: newStudents.editorId } } } }).select("-_id").select("-__v")
                    for (let i = 0; i < q.length; i++) {
                        let similarityRate = []
                        let temptitle = nowTitle
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





                    q = await Archive.find({ students: { $not: { $elemMatch: { id: newStudents.editorId } } } }).select("-_id").select("-__v")
                    for (let i = 0; i < q.length; i++) {
                        let similarityRate = []
                        let temptitle = nowTitle
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


                    q = await Project.find({ doctor: nowDoc, year: nowYear, students: { $not: { $elemMatch: { id: newStudents.editorId } } } }).select("-_id").select("-__v")
                    if (q.length >= docMax) errors.push("الدكتور " + nowDoc + " لم تعد لديه شواغر<br>");


                    q = await Project.find({ guider: nowEng, year: nowYear, students: { $not: { $elemMatch: { id: newStudents.editorId } } } }).select("-_id").select("-__v")
                    if (q.length >= engMax) errors.push("المهندس " + nowEng + " لم تعد لديه شواغر<br>");


                } catch (error) {
                    b = true;
                }

                if (!nowStudentsIds.length) {
                    n = oldStudents.length
                    for (let i = 0; i < n; i++) {
                        nowStudentsIds.push(oldStudents[i].id)
                    }
                }
                n = nowStudentsIds.length

                if (nowStudentsIds.length) {
                    for (let i = 0; i < n; i++) {

                        try {
                            let si = await Student.find({ id: nowStudentsIds[i] }).select("-_id").select("-__v")
                            if (!si.length) {
                                errors.push("الطالب صاحب الرقم" + nowStudentsIds[i] + " غير موجود<br>");
                                notFound = true;
                            } else {
                                majors[si[0].major - 1].push(si[0].name)
                                nowStudents.push(si[0])

                                q = await Project.find({ $and: [{ students: { $not: { $elemMatch: { id: newStudents.editorId } } } }, { students: { $elemMatch: { id: si[0].id } } }, { year: nowYear }] }).select("-_id").select("-__v")
                                if (q.length) {
                                    errors.push("الطالب " + si[0].name + " مشترك في مشروع اّخر<br>");
                                }



                                q = await Archive.find({ students: { $elemMatch: { id: si[0].id } }, year: nowYear }).select("-_id").select("-__v")
                                if (q.length) errors.push("الطالب " + si[0].name + " قد قدم المشروع بالفعل في السنوات السابقة<br>");

                                if (si[0].year != nowYear) errors.push("الطالب " + si[0].name + " في سنة أخرى<br>");
                            }
                        } catch (error) {
                            b = true;
                        }

                    }


                    if (nowStudentsIds.length < minProjext || nowStudentsIds.length > maxProject) {
                        numberError = true
                        errors.push("عدد الطلاب غير مقبول (لا يتم احتساب التكرارات والإدخالات الفارغة)<br>")
                    }
                    if (newStudents.freq) {
                        errors.push("هناك طلاب مكررين<br>")
                    }
                }


                let m = ["برمجيات", "شبكات", "ذكاء"]
                if (!notFound && majors[docMajor - 1].length < nowStudents.length / 2) {
                    errors.push("عدد الطلاب من خارج قسم ال" + m[docMajor - 1] + " هو " + (nowStudents.length - majors[docMajor - 1].length) + " يفوق عدد طلاب ال" + m[docMajor - 1] + " وهو " + (majors[docMajor - 1].length) + " والمشروع تابع لل" + m[docMajor - 1] + "<br>")
                }
                if (docMajor != engMajor) errors.push("المهندس يجب أن يكون من نفس اختصاص الدكتور<br>")


            }
            async function update() {
                if (!errors.length && !b && !breakall && !newStudents.freq && !numberError) {
                    try {
                        const q = await Project.findOneAndUpdate({ students: { $elemMatch: { id: newStudents.editorId } } }, { project_title: nowTitle, students: nowStudents, doctor: nowDoc, guider: nowEng, year: nowYear });
                    } catch (error) { b = true; }
                }
            }

            await condition();
            // await update();

            let s = "";
            for (let i = 0; i < errors.length; i++) {
                s += errors[i] + "<br>";
            }

            if (b)
                s += "حدث خطأ في التسجيل"


            if (!errors.length && !b && !numberError && !newStudents.freq && s == "" && !breakall) {
                test2 = true;
                const forSubmit = new Project({ project_title: nowTitle, students: nowStudents, doctor: nowDoc, guider: nowEng, year: nowYear });
                resultForStudents = {
                    "similarOldProjects": similarOldProjects,
                    "similarProjects": similarProjects,
                    "oldProject": oldProject,
                    "forSubmit": forSubmit,
                    "errors": s,
                    "editorId": newStudents.editorId
                };
            } else if (breakall || b) {
                resultForStudents = {
                    "errors": s,
                };
            } else {
                test2 = false;
                const forSubmit = new Project({ project_title: nowTitle, students: nowStudents, doctor: nowDoc, guider: nowEng, year: nowYear });
                resultForStudents = {
                    "similarOldProjects": similarOldProjects,
                    "similarProjects": similarProjects,
                    "oldProject": oldProject,
                    "forSubmit": forSubmit,
                    "errors": s,
                    "editorId": newStudents.editorId
                };
            }

            res.send();





        })

        app.post("/confirmEdit", async(req, res) => {
            const Project = require('../Models/projectModel');

            try {
                const q = await Project.findOneAndUpdate({ students: { $elemMatch: { id: resultForStudents.editorId } } }, { project_title: resultForStudents.forSubmit.project_title, students: resultForStudents.forSubmit.students, doctor: resultForStudents.forSubmit.doctor, guider: resultForStudents.forSubmit.guider, year: resultForStudents.forSubmit.year });
            } catch (error) {
                b = true;
            }
        })
        app.get("/editInfo", async(req, res) => {
            let obj = {
                "test": test2,
                "resultForStudents": resultForStudents
            }
            res.json(obj)
        })

    }
}