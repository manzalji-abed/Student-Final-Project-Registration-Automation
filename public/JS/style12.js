$(document).ready(async function() {

    let tableData
    let request = async() => {
        const response = await fetch('http://localhost:3002/report12');
        const data = await response.json();
        tableData = data
        let s = JSON.stringify(data);
        let str = s.replaceAll("\"state\"", "حالة الطالب  ").replaceAll("\"specialization\":2", "الاختصاص : شبكات");
        str = str.replaceAll("\"specialization\":1", "الاختصاص : برمجيات")
        str = str.replaceAll("\"name\"", "الاسم")
        str = str.replaceAll("\"level\":0", "المرحلة الدراسية : دكتوراه ")
        str = str.replaceAll("\"level\":1", "المرحلة الدراسية : ماجستير ")
        str = str.replaceAll("\"giv\"", "ممنوح")
        str = str.replaceAll("\"reg\"", "مسجل")
        str = str.replaceAll("\"date\"", "التاريخ")
        str = str.replaceAll("\"albaathDecisionNum\"", "رقم القرار ")
        str = str.replaceAll("\"id\"", "الرقم الجامعي")
        str = str.replaceAll("englishMessageTitle", " عنوان الرسالة بالانجليزي")
        str = str.replaceAll("arabicMessageTitle", "عنوان الرسالة بالعربي")
        str = str.replaceAll("supervisor", " اسم الدكتور ")
        str = str.replaceAll("studentID", " رقم الطالب  ")
        str = str.replaceAll("studentName", "اسم الطالب ")
        str = str.replaceAll(":00:00.000Z", "")
        str = str.replaceAll("T00", "")
        document.getElementById("report12").innerHTML = str;

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


    let headcontent
    $(".query-head-item").each(function() {
        headcontent = $(this).html();
        if (headcontent == "<div class=\"query-head-title\"></div>") {
            $(this).html("<div class=\"query-head-title\">كل القرارات</div>")
        }
    })

    let anscontent
    $(".query-ans").each(function() {
        anscontent = $(this).html();
        if (anscontent == "<div class=\"sub-sen\">التقرير :</div>") {
            $(this).html("<div class='sub-sen'>التقرير :</div>" + "<div class='ans'>لا يوجد مشاريع.<br></div>")
        }
    })

    let tableContent = ""


    let tableNum = tableData.length;
    for (let i = 0; i < tableNum; i++) {
        tableContent += "<table class=\"table table-md container table-bordered\"><thead class=\" table-dark\"><tr><th scope=\"col\">رقم القرار</th><th scope=\"col\">تاريخ القرار</th><th scope=\"col\">الدكتور المشرف</th><th scope=\"col\">رقم الطالب</th><th scope=\"col\">اسم الطالب</th><th scope=\"col\">المرحلة</th><th scope=\"col\">الاختصاص</th><th scope=\"col\">العنوان بالعربية</th><th scope=\"col\">العنوان بالإنجليزية</th><th scope=\"col\">الحالة</th></tr></thead>"
        let tableObj = tableData[i][1].length
        for (let j = 0; j < tableObj; j++) {
            if (j == 10) {
                tableContent += "</table>"
                tableContent += "<table class=\"table table-md container table-bordered\"><thead class=\" table-dark\"><tr><th scope=\"col\">رقم القرار</th><th scope=\"col\">تاريخ القرار</th><th scope=\"col\">الدكتور المشرف</th><th scope=\"col\">رقم الطالب</th><th scope=\"col\">اسم الطالب</th><th scope=\"col\">المرحلة</th><th scope=\"col\">الاختصاص</th><th scope=\"col\">العنوان بالعربية</th><th scope=\"col\">العنوان بالإنجليزية</th><th scope=\"col\">الحالة</th></tr></thead>"
            }
            tableContent += "<tr><td>" + tableData[i][1][j].albaathDecisionNum + "</td>"
            tableContent += "<td>" + tableData[i][1][j].date.replaceAll(":00:00.000Z", "").replaceAll("T00", "") + "</td>"
            tableContent += "<td>" + tableData[i][1][j].supervisor + "</td>"
            tableContent += "<td>" + tableData[i][1][j].studentID + "</td>"
            tableContent += "<td>" + tableData[i][1][j].studentName + "</td>"
            if (tableData[i][1][j].level == 0)
                tableContent += "<td>" + "دكتوراه" + "</td>"
            else
                tableContent += "<td>" + "ماجستير" + "</td>"

            if (tableData[i][1][j].specialization == 1)
                tableContent += "<td>" + "برمجيات" + "</td>"
            else
                tableContent += "<td>" + "شبكات" + "</td>"

            tableContent += "<td>" + tableData[i][1][j].arabicMessageTitle + "</td>"
            tableContent += "<td>" + tableData[i][1][j].englishMessageTitle + "</td>"
            if (tableData[i][1][j].state == "reg")
                tableContent += "<td>" + "مسجل" + "</td></tr>"
            else
                tableContent += "<td>" + "ممنوح" + "</td></tr>"


        }
        tableContent += "</table>"
    }

    $(".for-design").click(function() {
        $(".json").html(tableContent);
        $(".btn-toggler-active").removeClass("btn-toggler-active")
        $(this).addClass("btn-toggler-active")
    })
    $(".for-print").click(function() {
        $(".json").html(newContent)
        let headcontent
        $(".query-head-item").each(function() {
            headcontent = $(this).html();
            if (headcontent == "<div class=\"query-head-title\"></div>") {
                $(this).html("<div class=\"query-head-title\">كل القرارات</div>")
            }
        })

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