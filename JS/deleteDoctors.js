module.exports = {

    get: function(app, dic) {
        app.get("/deleteDoctors", (req, res) => {
            res.sendFile(dic + "/HTML/deleteDoctors.html");
        })
    },
    post: function(app) {
        let resultForStudents;
        const Doctor = require('../Models/doctorModel');
        const Engineer = require('../Models/engineerModel');
        app.post("/deleteDoctors", async(req, res) => {

            let data = req.body;


            let b = false,
                errors = [],
                olddata = [],
                olddataEng = [];
            let n,
                q;



            async function checkingDoctors() {

                n = data.deletedDoctor.length


                for (let i = 0; i < n; i++) {
                    try {
                        if (data.deletedDoctor[i] != "") {
                            q = await Doctor.find({ name: data.deletedDoctor[i] })
                            olddata.push(q[0])
                        }
                    } catch (error) {
                        b = true;
                    }
                }
            }
            async function checkingEngs() {


                n = data.deletedEng.length;

                for (let i = 0; i < n; i++) {
                    try {
                        if (data.deletedEng[i] != "") {
                            q = await Engineer.find({ name: data.deletedEng[i] })
                            olddataEng.push(q[0])
                        }
                    } catch (error) {
                        b = true;
                    }
                }

            }

            await checkingDoctors();
            await checkingEngs();

            resultForStudents = {
                "errors": errors,
                "olddata": olddata,
                "olddataEng": olddataEng,
                "data": data
            }

            res.send();


        })

        app.get("/deleteDocInfo", async(req, res) => {
            res.json({
                "resultForStudents": resultForStudents
            });
        })
        app.post("/deleteDoc12", async(req, res) => {
            async function deletingDocs() {
                let q, b;
                let n = (resultForStudents.data.deletedDoctor) ? resultForStudents.data.deletedDoctor.length : 0;


                for (let i = 0; i < n; i++) {
                    try {
                        if (resultForStudents.data.deletedDoctor[i] != "")
                            q = await Doctor.deleteOne({ name: resultForStudents.data.deletedDoctor[i] })
                    } catch (error) {
                        b = true;
                    }
                }
            }

            async function deletingEngs() {

                let q, b;

                let n = resultForStudents.data.deletedEng.length;

                for (let i = 0; i < n; i++) {
                    try {
                        if (resultForStudents.data.deletedEng[i] != "")
                            q = await Engineer.deleteOne({ name: resultForStudents.data.deletedEng[i] })
                    } catch (error) {
                        b = true;
                    }
                }

            }

            await deletingDocs();
            await deletingEngs();



        })

    }
}