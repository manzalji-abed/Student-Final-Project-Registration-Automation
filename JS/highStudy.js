module.exports = {
    get: function(app, dic) {
        app.get("/highStudy", (req, res) => {
            res.sendFile(dic + "/HTML/highStudy.html");
        })
    },
    post: function(app, dic) {
        const HighStudy = require('../Models/highStudyModel');

        app.post("/highStudy", async(req, res) => {
            let data = req.body;

            let b = false,
                errors = [],
                ex = false,
                q;

            async function checkEx() {
                try {
                    q = await HighStudy.find({ albaathDecisionNum: data.albaathDecisionNum, date: data.albaathDecisionDate })
                    if (q.length) { b = true, ex = true }
                } catch (error) { b = ture }
            }

            async function inserting() {
                try {
                    const info = new HighStudy({
                        studentName: data.studentName,
                        studentID: data.studentID,
                        specialization: data.specialization,
                        level: data.level,
                        supervisor: data.supervisor,
                        arabicMessageTitle: data.arabicMessageTitle,
                        englishMessageTitle: data.englishMessageTitle,
                        albaathDecisionNum: data.albaathDecisionNum,
                        date: data.albaathDecisionDate,
                        state: data.regOrGiv
                    });
                    q = await HighStudy.insertMany(info);
                } catch (error) {
                    b = true;
                }

            }

            if (data.albaathDecisionDate == '' || data.albaathDecisionNum == '') {
                errors += "أدخل رقم وتاريخ القرار<br>"

            } else {
                await checkEx();
                if (ex) errors += " القرار موجود مسبقا<br>";
                else {
                    await inserting();
                    if (b)
                        errors += "حدث خطأ في التسجيل<br>"
                }

            }
            // if (errors.length) res.send(errors)
            res.send("success")

        })
    }
}