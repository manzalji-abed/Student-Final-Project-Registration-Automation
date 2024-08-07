module.exports = {
    get: function(app, dic) {
        app.get("/report", (req, res) => {
            res.sendFile(dic + "/HTML/report.html");
        })
        app.get("/report1", (req, res) => {
            res.sendFile(dic + "/HTML/testForJson1.html");

        })
    },
    post: function(app) {
        let reports = [];
        app.post("/report", async(req, res) => {
            const HighStudy = require('../Models/highStudyModel');
            let data = req.body;
            let query = [],
                b = false,
                q;

            async function getResult(condition) {
                try {
                    Object.keys(condition).forEach((k) => condition[k] == "" && delete condition[k]);
                    q = await HighStudy.find(condition).select("-_id").select("-__v")
                    query.push([condition, q]);
                } catch (error) { b = true; }
            }

            let n = data.students.length;

            for (let i = 0; i < n; i++) {
                const info = {
                    studentName: data.students[i],
                    studentID: data.studentID[i],
                    specialization: data.specialization[i],
                    level: data.level[i],
                    supervisor: data.doctors[i],
                    albaathDecisionNum: data.decisions[i],
                    date: data.decisionsDate[i],
                    state: data.stats[i]
                }
                await getResult(info);
            }

            if (!b) {
                reports = query
                res.send(query);
            } else res.send("error");

        })

        app.get("/report12", async(req, res) => {
            res.json(reports);

        })

    },
    reportInit: function(data) {
        let doctors = data.doctorReports;
        let engs = data.engReports;
        let student = data.studentReports;
        let year = data.yearReports;
        let date = data.dateReports;
        let doctorYear = data.doctorYear;
        let engYear = data.engYear;

        if (doctors == undefined) doctors = []
        if (engs == undefined) engs = []



        let doctorRe = {
            doctorName: doctors,
            doctorYears: doctorYear
        }

        let engRe = {
            engName: engs,
            engYears: engYear
        }

        let result = new Map();

        result.set("Doctors", doctorRe);
        result.set("Engs", engRe);
        result.set("Years", year);
        result.set("Students", student);
        result.set("Date", date);

        for (let [key, value] of result) {
            if (value == undefined)
                result.set(key, [])
        }

        return result;

    }
};