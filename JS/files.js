module.exports = {

    get: function(app, dic) {
        app.get("/files", (req, res) => {
            res.sendFile(dic + "/HTML/files.html");

        })
    },
    post: function(app, dic) {
        let test = true,
            resultForStudents;
        const Student = require('../Models/studentModel');

        const reader = require('xlsx');

        app.post("/files", async(req, res) => {
            var sectionFile;
            var yearFile;
            let file, data = [],
                errors = [],
                b = false;

            async function uploadFile() {
                q = await file.mv(dic + '/uploaded/file.xlsx')
            }

            async function readingFile() {
                const File = reader.readFile(dic + '/uploaded/file.xlsx');
                const sheets = File.SheetNames;
                for (let i = 0; i < sheets.length; i++) {
                    const temp = reader.utils.sheet_to_json(File.Sheets[File.SheetNames[i]]);
                    temp.forEach((info) => {
                        data.push(info);
                    });
                }
            }

            async function check() {
                let n = data.length;
                if (n == 0) {
                    errors.push("الملف فارغ<br>")
                }
                for (let i = 0; i < n; i++) {
                    if (Object.keys(data[i]).length < 3) {
                        errors.push("الطالب في السطر رقم " + (i + 2) + " معلوماته منقوصة<br>");
                    }
                    if (typeof data[i][Object.keys(data[i])[0]] != "number" || typeof data[i][Object.keys(data[i])[1]] != "string" || typeof data[i][Object.keys(data[i])[2]] != "string") {
                        errors.push("ترتيب الحقول أو أنماط المعلومات غير صحيح عند الطالب في السطر رقم " + (i + 2) + "<br>");
                    }
                }
            }

            async function deleting() {
                try {
                    let q = await Student.deleteMany({ year: yearFile, major: sectionFile })
                } catch (error) {
                    b = true
                }
            }

            async function insert() {
                let n = data.length;
                for (let i = 0; i < n; i++) {
                    try {
                        const ins = await Student.insertMany({ id: data[i][Object.keys(data[i])[0]], name: data[i][Object.keys(data[i])[1]], father: data[i][Object.keys(data[i])[2]], year: yearFile, major: sectionFile });
                    } catch (error) {
                        b = true;
                    }
                }
            }




            if (req.files) {
                file = req.files.file;
                major = req.body.major;

                yearFile = Number(major[0]);
                sectionFile = Number(major[1]);


                await uploadFile();
                await readingFile();
                await check();
            } else errors.push("لم يتم رفع الملف<br>")



            if (errors.length) {
                test = false;
                resultForStudents = {
                    "errors": errors
                }
            } else {
                test = true;
                resultForStudents = {
                    "data": data,
                    "yearFile": yearFile,
                    "sectionFile": sectionFile,
                    "errors": errors
                }


            }

            // هوووون مكاتب وشغلات يلا رنقلع
            if (test) {
                async function deleting() {
                    try {
                        let q = await Student.deleteMany({ year: yearFile, major: sectionFile })
                    } catch (error) {
                        b = true
                    }
                }

                async function insert() {
                    let n = data.length;
                    for (let i = 0; i < n; i++) {
                        try {
                            const ins = await Student.insertMany({ id: data[i][Object.keys(data[i])[0]], name: data[i][Object.keys(data[i])[1]], father: data[i][Object.keys(data[i])[2]], year: yearFile, major: sectionFile });
                        } catch (error) {
                            b = true;
                        }
                    }
                }

                await deleting();
                await insert();
            }

            res.send();





        })

        app.get("/files1", async(req, res) => {
            res.json({
                "test": test,
                "resultForStudents": resultForStudents
            });

        })

    }
}