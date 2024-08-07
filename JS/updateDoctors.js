module.exports = {

    get: function(app, dic) {
        app.get("/updateDoctors", (req, res) => {
            res.sendFile(dic + "/HTML/updateDoctors.html");
        })
    },
    post: function(app) {
        let resultForStudents;
        const Doctor = require('../Models/doctorModel');
        const Engineer = require('../Models/engineerModel');
        app.post("/updateDoctors", async(req, res) => {


            let data = req.body;

            let b = false,
                errors = [];

            let n,
                olddata_doctors = [],
                olddata_engs = [],
                newdata_doctors = [],
                newdata_engs = [],
                oldtemp,
                temp = {
                    name: String,
                    major: Number,
                    maxFour: Number,
                    maxFive: Number
                },
                q;


            async function checkingDoctors() {

                n = data.editedDoctor.length

                for (let i = 0; i < n; i++) {
                    try {
                        let temp = {
                            name: String,
                            major: Number,
                            maxFour: Number,
                            maxFive: Number
                        }

                        if (data.editedDoctor[i] != "") {
                            oldtemp = await Doctor.find({ name: data.editedDoctor[i] }).select("-_id").select("-__v")
                            olddata_doctors.push(oldtemp[0])
                            temp.name = (data.doctors[i] != "") ? data.doctors[i] : oldtemp[0].name;
                            temp.major = (data.doctorsMajor[i] != "") ? data.doctorsMajor[i] : oldtemp[0].major;
                            temp.maxFour = (data.doctorsmax4[i] != "") ? data.doctorsmax4[i] : oldtemp[0].maxFour;
                            temp.maxFive = (data.doctorsmax5[i] != "") ? data.doctorsmax5[i] : oldtemp[0].maxFive;
                            newdata_doctors.push(temp);


                        }

                    } catch (error) {
                        b = true;
                    }
                }
            }

            async function checkingEngs() {

                n = data.editedEng.length;

                for (let i = 0; i < n; i++) {
                    try {
                        let temp = {
                            name: String,
                            major: Number,
                            maxFour: Number,
                            maxFive: Number
                        }
                        if (data.editedEng[i] != "") {
                            oldtemp = await Engineer.find({ name: data.editedEng[i] }).select("-_id").select("-__v")
                            olddata_engs.push(oldtemp[0])
                            temp.name = (data.engs[i] != "") ? data.engs[i] : oldtemp[0].name;
                            temp.major = (data.engMajor[i] != "") ? data.engMajor[i] : oldtemp[0].major;
                            temp.maxFour = (data.engMax4[i] != "") ? data.engMax4[i] : oldtemp[0].maxFour;
                            temp.maxFive = (data.engMax5[i] != "") ? data.engMax5[i] : oldtemp[0].maxFive;
                            newdata_engs.push(temp)


                        }

                    } catch (error) {
                        b = true;
                    }
                }
            }

            await checkingDoctors()
            await checkingEngs()

            resultForStudents = {
                "errors": errors,
                "olddata_doctors": olddata_doctors,
                "newdata_doctors": newdata_doctors,
                "olddata_engs": olddata_engs,
                "newdata_engs": newdata_engs,
                "data": data
            }


            res.send();



        })


        app.get("/editDocInfo", async(req, res) => {
            res.json({
                "resultForStudents": resultForStudents
            });
        })
        app.post("/editDoc12", async(req, res) => {
            async function insertingDoctors() {
                let q, b;
                let n = resultForStudents.data.editedDoctor.length


                for (let i = 0; i < n; i++) {
                    try {
                        if (resultForStudents.data.editedDoctor[i] != "") {
                            q = await Doctor.findOneAndUpdate({ name: resultForStudents.data.editedDoctor[i] }, { name: resultForStudents.newdata_doctors[i].name, major: resultForStudents.newdata_doctors[i].major, maxFour: resultForStudents.newdata_doctors[i].maxFour, maxFive: resultForStudents.newdata_doctors[i].maxFive })
                        }
                    } catch (error) {
                        b = true;

                    }
                }
            }

            async function insertingEngs() {

                let q, b;
                let n = resultForStudents.data.editedEng.length;

                for (let i = 0; i < n; i++) {
                    try {
                        if (resultForStudents.data.editedEng[i] != "") {
                            q = await Engineer.findOneAndUpdate({ name: resultForStudents.data.editedEng[i] }, { name: resultForStudents.newdata_engs[i].name, major: resultForStudents.newdata_engs[i].major, maxFour: resultForStudents.newdata_engs[i].maxFour, maxFive: resultForStudents.newdata_engs[i].maxFive })
                        }
                    } catch (error) {
                        b = true;
                    }
                }
            }




            await insertingDoctors();
            await insertingEngs();



        })


    }
}