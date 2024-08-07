module.exports = {

    get: function(app, dic) {
        app.get("/updateHighStudy", (req, res) => {
            res.sendFile(dic + "/HTML/updateHighStudy.html");
        })
    },
    post: function(app) {
        let test;
        let resultForStudents;
        app.post("/updateHighStudy", async(req, res) => {
            let data = req.body;
            const HighStudy = require('../Models/highStudyModel');

            let b = false,
                exist = false,
                errors = [],
                newInfo = {
                    studentName: String,
                    studentID: Number,
                    specialization: Number,
                    level: Number,
                    supervisor: String,
                    arabicMessageTitle: String,
                    englishMessageTitle: String,
                    albaathDecisionNum: Number,
                    date: Date,
                    state: String
                },
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
            async function makeNewInfo() {
                try {
                    newInfo.studentName = (data.studentName != '') ? data.studentName : oldInfo.studentName;
                    newInfo.studentID = (data.studentID != '') ? data.studentID : oldInfo.studentID;
                    newInfo.specialization = (data.specialization != '') ? data.specialization : oldInfo.specialization;
                    newInfo.level = (data.level != '') ? data.level : oldInfo.level;
                    newInfo.supervisor = (data.supervisor != '') ? data.supervisor : oldInfo.supervisor;
                    newInfo.arabicMessageTitle = (data.arabicMessageTitle != '') ? data.arabicMessageTitle : oldInfo.arabicMessageTitle;
                    newInfo.englishMessageTitle = (data.englishMessageTitle != '') ? data.englishMessageTitle : oldInfo.englishMessageTitle;
                    newInfo.albaathDecisionNum = (data.newAlbaathDecisionNum != '') ? data.newAlbaathDecisionNum : oldInfo.albaathDecisionNum;
                    newInfo.date = (data.newAlbaathDecisionDate != '') ? data.newAlbaathDecisionDate : oldInfo.date;
                    newInfo.state = (data.regOrGiv != '') ? data.regOrGiv : oldInfo.state;

                } catch (error) { b = true; }
            }
            async function updating() {
                try {
                    q = await HighStudy.updateOne({ albaathDecisionNum: data.albaathDecisionNum, date: data.albaathDecisionDate }, {
                        studentName: newInfo.studentName,
                        studentID: newInfo.studentID,
                        specialization: newInfo.specialization,
                        level: newInfo.level,
                        supervisor: newInfo.supervisor,
                        arabicMessageTitle: newInfo.arabicMessageTitle,
                        englishMessageTitle: newInfo.englishMessageTitle,
                        albaathDecisionNum: newInfo.albaathDecisionNum,
                        date: newInfo.date,
                        state: newInfo.state
                    });
                } catch (error) {
                    b = true;
                }


            }

            if (data.albaathDecisionDate == '' || data.albaathDecisionNum == '') {
                errors += "أدخل رقم وتاريخ القرار المراد تعديله<br>"
            } else {
                await checkIfExist();
                if (!exist) errors += "القرار غير موجود<br>";
            }

            if (errors.length) {
                test = false;
                resultForStudents = {
                    "errors": errors
                }
            } else {
                test = true;

                await makeNewInfo();
                resultForStudents = {
                    "newInfo": newInfo,
                    "oldInfo": oldInfo,
                    "albaathDecisionNum": data.albaathDecisionNum,
                    "albaathDecisionDate": data.albaathDecisionDate
                }
            }

            res.send();


        })

        app.get("/updateInfo", (req, res) => {
            res.json({
                "test": test,
                "resultForStudents": resultForStudents
            });
        })


        app.post("/confirmUpdate12", async(req, res) => {
            const HighStudy = require('../Models/highStudyModel');

            try {
                q = await HighStudy.updateOne({ albaathDecisionNum: resultForStudents.albaathDecisionNum, date: resultForStudents.albaathDecisionDate }, {
                    studentName: resultForStudents.newInfo.studentName,
                    studentID: resultForStudents.newInfo.studentID,
                    specialization: resultForStudents.newInfo.specialization,
                    level: resultForStudents.newInfo.level,
                    supervisor: resultForStudents.newInfo.supervisor,
                    arabicMessageTitle: resultForStudents.newInfo.arabicMessageTitle,
                    englishMessageTitle: resultForStudents.newInfo.englishMessageTitle,
                    albaathDecisionNum: resultForStudents.newInfo.albaathDecisionNum,
                    date: resultForStudents.newInfo.date,
                    state: resultForStudents.newInfo.state
                });
            } catch (error) {
                b = true;
            }
        })
    }
}