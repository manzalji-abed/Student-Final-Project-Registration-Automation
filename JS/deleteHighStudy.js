module.exports = {

    get: function(app, dic) {
        app.get("/deleteHighStudy", (req, res) => {
            res.sendFile(dic + "/HTML/deleteHighStudy.html");
        })
    },
    post: function(app) {
        let test = true,
            resultForStudents
        const HighStudy = require('../Models/highStudyModel');
        app.post("/deleteHighStudy", async(req, res) => {
            let data = req.body;
            let b = false,
                exist = false,
                errors = [],
                q, oldInfo;


            async function checkIfExist() {
                try {
                    q = await HighStudy.find({ albaathDecisionNum: data.albaathDecisionNum, date: data.albaathDecisionDate }).select("-_id").select("-__v")
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
                    q = await HighStudy.deleteOne({ albaathDecisionNum: data.albaathDecisionNum, date: data.albaathDecisionDate });

                } catch (error) {
                    b = true;
                }


            }

            if (data.albaathDecisionDate == '' || data.albaathDecisionNum == '') {
                errors += "أدخل رقم وتاريخ القرار المراد حذفه<br>"
            } else {
                await checkIfExist();
                if (!exist) errors += "القرار غير موجود<br>";
            }

            if (errors.length) {
                test = false
                resultForStudents = {
                    "errors": errors
                }

            } else {
                test = true
                resultForStudents = {
                    "errors": errors,
                    "oldInfo": oldInfo,
                    "albaathDecisionNum": data.albaathDecisionNum,
                    "albaathDecisionDate": data.albaathDecisionDate
                }

            }


            res.send();



            // هون الكووود




        })
        app.get("/deleteInfo12", async(req, res) => {
            res.json({
                "test": test,
                "resultForStudents": resultForStudents
            });
        })
        app.post("/deleteConfirm12", async(req, res) => {
            try {
                q = await HighStudy.deleteOne({ albaathDecisionNum: resultForStudents.albaathDecisionNum, date: resultForStudents.albaathDecisionDate });

            } catch (error) {
                b = true;
            }



        })
    }
}