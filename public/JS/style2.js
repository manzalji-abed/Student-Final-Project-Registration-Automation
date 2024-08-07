$(document).ready(async function() {


    let tableData;
    let request = async() => {
        const response = await fetch('http://localhost:3002/query12');
        const data = await response.json();
        tableData = data;
        let s = JSON.stringify(data);
        let str = s.replaceAll("\"father\"", "اسم الأب").replaceAll("\"major\":2", "الاختصاص : شبكات");
        str = str.replaceAll("\"major\":1", "الاختصاص : برمجيات")
        str = str.replaceAll("\"name\"", "الاسم")
        str = str.replaceAll("\"year\":4", "السنة : الرابعة")
        str = str.replaceAll("\"year\":5", "السنة : الخامسة")
        str = str.replaceAll("\"year\"", "السنة")
        str = str.replaceAll("\"doctor\"", "الدكتور")
        str = str.replaceAll("\"guider\"", "المشرف")
        str = str.replaceAll("\"project_title\"", "اسم المشروع")
        str = str.replaceAll("\"id\"", "الرقم الجامعي")
        str = str.replaceAll("state", "حالة الطالب")
        str = str.replaceAll("all", "الجميع")
        str = str.replaceAll("unsigned", "غير المسجلين")
        str = str.replaceAll("signed", "المسجلين")
        str = str.replaceAll("students", "مشروع الطالب ")
        document.getElementById("i12").innerHTML = str;

    }
    await request();



    let content = $(".json").html();

    let n = content.length;
    let newContent = ""

    let objlvl = 0,
        arraylvl = 0;
    let where = []
    let ans = false;


    for (let i = 0; i < n; i++) {
        if (content[i] == '"' || content[i] == '"');
        else {

            if (i <= n - 3 && content[i] == '_' && content[i + 1] == 'i' && content[i + 2] == 'd') {
                while (true) {
                    if (content[i] == ',') {
                        i++;
                        break;
                    } else if (content[i] == '}') {
                        break;
                    }
                    i++;
                }
            }

            if (content[i] == '[') {
                where.push(1)
                if (arraylvl == 1) {
                    newContent += "<div class='query'>"

                } else if (arraylvl == 2 && objlvl == 0) {
                    newContent += "<div class='query-ans'><div class='sub-sen'>التقرير :</div>"
                } else if (arraylvl == 2 && objlvl == 1) {
                    newContent += "<div class='query-head-list'><span class='query-head-list-item'>"
                } else if (arraylvl == 3 && objlvl == 1 && where[where.length - 1] == 1) {
                    newContent += "<div class='query-ans-list'><div class='query-ans-list-item'><span class='query-ans-list-item-key'>"
                }

                arraylvl++;

            } else if (content[i] == ']') {
                if (arraylvl == 2) {
                    newContent += "</div>"
                } else if (arraylvl == 3 && objlvl == 0) {
                    newContent += "</div>"
                } else if (arraylvl == 3 && objlvl == 1 && where[where.length - 1] == 1) {
                    newContent += "</span></div>"
                } else if (arraylvl == 4 && objlvl == 1 && where[where.length - 1] == 1) {
                    newContent += "</span></div></div>"
                }


                arraylvl--;
                where.pop()


            } else if (content[i] == '{') {
                where.push(2)
                if (arraylvl == 2) {
                    newContent += "<div class='query-head'> <div class='sen'>الطلب :</div><div class='query-head-item'><div class='query-head-title'>"
                } else if (arraylvl == 3 && objlvl == 0) {
                    newContent += "<div class='ans'><div class='query-ans-item'><div class='query-ans-title'>"
                }
                objlvl++;

            } else if (content[i] == '}') {
                if (arraylvl == 2) {
                    newContent += "</div></div></div>"
                } else if (arraylvl == 3 && objlvl == 1) {
                    newContent += "</div></div></div>"
                }

                where.pop()

                objlvl--;

            } else if (content[i] == ':') {
                if (arraylvl == 2 && objlvl == 1) {
                    newContent += ": </div><div class='value'>"
                } else if (arraylvl == 3 && objlvl == 1 && where[where.length - 1] == 2) {
                    newContent += ": </div><div class='value'>"
                } else if (arraylvl == 4 && objlvl == 2 && where[where.length - 1] == 2) {
                    newContent += ": </span><span class='query-ans-list-item-value'>"
                }



            } else if (content[i] == ',') {



                if (arraylvl == 2 && objlvl == 1) {
                    newContent += "</div></div><div class='query-head-item'><div class='query-head-title'>"
                } else if (arraylvl == 3 && objlvl == 1 && where[where.length - 1] == 2) {
                    newContent += "</div></div><div class='query-ans-item'><div class='query-ans-title'>"
                } else if (arraylvl == 3 && objlvl == 1 && where[where.length - 1] == 1) {
                    newContent += "</span><span class='query-head-list-item'>"
                } else if (arraylvl == 4 && objlvl == 1 && where[where.length - 1] == 1) {
                    newContent += "</span></div><div class='query-ans-list-item'><span class='query-ans-list-item-key'>"
                } else if (arraylvl == 4 && objlvl == 2 && where[where.length - 1] == 2) {
                    newContent += "</span><span class='query-ans-list-item-key'>"
                }


            } else {
                newContent += content[i];
            }
        }
    }




    $(".json").html(newContent)

    let tableContent = ""


    let tableNum = tableData.length;
    for (let i = 0; i < tableNum; i++) {
        if (tableData[i][0].state) {
            tableContent += "<table class=\"table table-md container table-bordered\"><thead class=\" table-dark\"><tr><th scope=\"col\">رقم الطالب</th><th scope=\"col\">اسم الطالب</th><th scope=\"col\">اسم الأب</th><th scope=\"col\">السنة</th><th scope=\"col\">الاختصاص</th></tr></thead>"
            let tableObj = tableData[i][1].length
            for (let j = 0; j < tableObj; j++) {
                if (j == 10) {
                    tableContent += "</table>"
                    tableContent += "<table class=\"table table-md container table-bordered\"><thead class=\" table-dark\"><tr><th scope=\"col\">رقم الطالب</th><th scope=\"col\">اسم الطالب</th><th scope=\"col\">اسم الأب</th><th scope=\"col\">السنة</th><th scope=\"col\">الاختصاص</th></tr></thead>"
                }
                tableContent += "<tr><td>" + tableData[i][1][j].id + "</td>"
                tableContent += "<td>" + tableData[i][1][j].name + "</td>"
                tableContent += "<td>" + tableData[i][1][j].father + "</td>"
                tableContent += "<td>" + tableData[i][1][j].year + "</td>"
                if (tableData[i][1][j].major == 1)
                    tableContent += "<td>" + "برمجيات" + "</td></tr>"
                else
                    tableContent += "<td>" + "شبكات" + "</td></tr>"
            }
            tableContent += "</table>"
        } else {
            tableContent += "<table class=\"table table-md container table-bordered\"><thead class=\" table-dark\"><tr><th scope=\"col\">الدكتور المشرف</th><th scope=\"col\">المهندس المشرف</th><th scope=\"col\">عنوان المشروع</th><th scope=\"col\">الطلاب</th></tr></thead>"
            let tableObj = tableData[i][1].length
            for (let j = 0; j < tableObj; j++) {
                if (j == 10) {
                    tableContent += "</table>"
                    tableContent += "<table class=\"table table-sm container table-bordered\"><thead class=\" table-dark\"><tr><th scope=\"col\">الدكتور المشرف</th><th scope=\"col\">المهندس المشرف</th><th scope=\"col\">عنوان المشروع</th><th scope=\"col\">الطلاب</th></tr></thead>"
                }
                tableContent += "<tr><td>" + tableData[i][1][j].doctor + "</td>"
                tableContent += "<td>" + tableData[i][1][j].guider + "</td>"
                tableContent += "<td>" + tableData[i][1][j].project_title + "</td>"
                tableContent += "<td>"
                for (let k = 0; k < tableData[i][1][j].students.length; k++) {
                    tableContent += "<span class=\"students-name\">" + tableData[i][1][j].students[k].name + "</span>"
                    if (k != tableData[i][1][j].students.length - 1) tableContent += " - "
                }
                tableContent + "</td></tr>"
            }
            tableContent += "</table>"
        }

    }




    let anscontent
    $(".query-ans").each(function() {
        anscontent = $(this).html();
        if (anscontent == "<div class=\"sub-sen\">التقرير :</div>") {
            $(this).html("<div class='sub-sen'>التقرير :</div>" + "<div class='ans'>لا يوجد مشاريع.<br></div>")
        }
    })

    $(".for-design").click(function() {
        $(".json").html(tableContent);
        $(".btn-toggler-active").removeClass("btn-toggler-active")
        $(this).addClass("btn-toggler-active")
    })
    $(".for-print").click(function() {
        $(".json").html(newContent)
        let anscontent
        $(".query-ans").each(function() {
            anscontent = $(this).html();
            if (anscontent == "<div class=\"sub-sen\">التقرير :</div>") {
                $(this).html("<div class='sub-sen'>التقرير :</div>" + "<div class='ans'>لا يوجد مشاريع.<br></div>")
            }
        })
        $(".btn-toggler-active").removeClass("btn-toggler-active")
        $(this).addClass("btn-toggler-active")
    })




    $(".printing").click(function() {
        window.print();
    })








});