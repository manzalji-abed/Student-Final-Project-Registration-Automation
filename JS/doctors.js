module.exports = {
    get: function(app, dic) {
        app.get("/doctors", (req, res) => {
            res.sendFile(dic + "/HTML/doctors.html");

        })

    },
    post: function(app) {
        let test = true,
            resultForStudents;
        const Doctor = require('../Models/doctorModel');
        const Engineer = require('../Models/engineerModel');
        app.post("/doctors", async(req, res) => {


            let data = req.body;

            let n, q;

            let b = false,
                errors = [];

            async function checkingDocs() {

                n = data.doctors.length


                for (let i = 0; i < n; i++) {
                    try {
                        if (data.doctors[i] != "") {
                            q = await Doctor.find({ name: data.doctors[i] }).select("-_id").select("-__v")
                            if (q.length) {
                                b = true;
                                errors.push("الدكتور " + data.doctors[i] + " موجود مسبقا<br>")
                            }

                            if (data.doctorsMajor[i] == '' || data.doctorsmax4[i] == '' || data.doctorsmax5[i] == '') {
                                b = true;
                                errors.push("هناك إدخالات فارغة عند الدكتور " + data.doctors[i] + "<br>")
                            }
                        }
                    } catch (error) {
                        b = true;
                    }
                }
            }

            async function checkingEngs() {


                n = data.engs.length;
                for (let i = 0; i < n; i++) {
                    try {
                        if (data.engs[i] != "") {
                            q = await Engineer.find({ name: data.engs[i] }).select("-_id").select("-__v")
                            if (q.length) {
                                b = true;
                                errors.push("المهندس " + data.engs[i] + " موجود مسبقا<br>")
                            }

                            if (data.engMajor[i] == '' || data.engMax4[i] == '' || data.engMax5[i] == '') {
                                b = true;
                                errors.push("هناك إدخالات فارغة عند المهندس " + data.engs[i] + "<br>")
                            }
                        }
                    } catch (error) {
                        b = true;
                    }
                }


            }






            await checkingDocs();
            await checkingEngs();


            if (errors.length) {
                test = false;
                resultForStudents = {
                    "errors": errors
                }
            } else {
                test = true;
                resultForStudents = {
                    "data": data,
                    "errors": errors
                }
            }

            if (test) {
                async function insertingDocs() {
                    let n = resultForStudents.data.doctors.length,
                        q, b;

                    for (let i = 0; i < n; i++) {
                        try {
                            if (resultForStudents.data.doctors[i] != "") {
                                const rec = new Doctor({ name: resultForStudents.data.doctors[i], major: resultForStudents.data.doctorsMajor[i], maxFour: resultForStudents.data.doctorsmax4[i], maxFive: resultForStudents.data.doctorsmax5[i] })
                                q = await Doctor.insertMany(rec);
                            }
                        } catch (error) {
                            b = true;
                        }
                    }
                }

                async function insertingEngs() {

                    let n = resultForStudents.data.engs.length,
                        q, b;
                    for (let i = 0; i < n; i++) {
                        try {
                            if (resultForStudents.data.engs[i] != "") {
                                const rec = new Engineer({ name: resultForStudents.data.engs[i], major: resultForStudents.data.engMajor[i], maxFour: resultForStudents.data.engMax4[i], maxFive: resultForStudents.data.engMax5[i] })
                                q = await Engineer.insertMany(rec);
                            }
                        } catch (error) {
                            b = true;
                        }
                    }

                }

                await insertingDocs();
                await insertingEngs();
            }

            res.send();





        })


        app.get("/insertDocInfo", async(req, res) => {
            res.json({
                "test": test,
                "resultForStudents": resultForStudents
            });
        })
    }
};