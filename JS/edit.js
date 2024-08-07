module.exports = {
    editor: function(data) {

        let projectName = ""
        let doctorName = ""
        let supervisor = ""

        minProjext = 4;
        maxProject = 5;

        let numberError = false;
        const map = new Map();


        projectName = data.projectName;
        doctorName = data.doctor;
        supervisor = data.supervisor;
        yeaar = data.year;
        let students = [];
        let studentIds = [];
        let freq = false;
        let net = 0,
            pro = 0;
        for (let i = 0; i <= maxProject; i += 1) {
            let studentID;
            if (data.studentID[i]) {
                studentID = Number(data.studentID[i]);
                if (studentIds.includes(studentID))
                    freq = true;
                else
                    studentIds.push(studentID);

            }
        }




        let newStudents = {
            editorId: data.stdID,
            projectName: projectName,
            doctorName: doctorName,
            supervisor: supervisor,
            year: yeaar,
            newStudents: studentIds,
            freq: freq
        }

        return newStudents;

    }
}