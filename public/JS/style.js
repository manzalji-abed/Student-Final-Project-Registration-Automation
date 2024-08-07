$(document).ready(async function() {


    var DoctorsArray, EngineersArray;
    var dataname;
    let request = async() => {
        const response = await fetch('http://localhost:3002/result');
        const data = await response.json();
        dataname = data;
        DoctorsArray = dataname.Doctor;
        EngineersArray = dataname.Engineer;
    }


    await request();

    for (let i = 0; i < EngineersArray.length; i++) {
        $(".add-engs").after("<option value='" + EngineersArray[i].name + "'>" + EngineersArray[i].name + "</option>");
    }

    for (let i = 0; i < DoctorsArray.length; i++) {
        $(".add-docs").after("<option value='" + DoctorsArray[i].name + "'>" + DoctorsArray[i].name + "</option>");
    }



    $("[href]").each(function() {

        if (this.href.slice(-4) == window.location.href.slice(-4)) {
            $(this).addClass("current-page");
        }
        if (this.href == window.location.href) {
            $(this).addClass("sub-current-page");
        }
    });

    $(".fa-square-plus").mouseenter(function() {
        $(this).addClass("fa-solid");
    });

    $(".fa-square-plus").mouseleave(function() {
        $(this).removeClass("fa-solid");
    });

    $(".plus").click(function() {
        $(this).parent().before("<div class='added'>" + $(this).parent().prev($('div.added')).html() + "</div>");
    });

    $(".sub-plus").click(function() {
        $(this).parent().before("<div class='sub-added'>" + $(this).parent().prev($('div.sub-added')).html() + "</div>");
    });


    $(".back").attr("href", document.referrer);

    $(".eng").keypress(function(event) {
        var ew = event.which;
        if (ew >= 32 && ew <= 122)
            return true;
        return false;
    });







});