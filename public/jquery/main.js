var pdf = require('../apps/pdf/pdfViewer');

// DATABASE SECTION
// Menu controls
$(".db-portal-handler, .stock-scraper-handler, .pdf-scraper-handler, .financial-report-handler, .company-overview-handler").click(function (event) {
    // event.preventDefault();
    $(".db-portal, .stock-scraper, .pdf-scraper, .financial-report, .company-overview").css("opacity", 0.1);
    $(".db-portal-handler, .stock-scraper-handler, .pdf-scraper-handler, .financial-report-handler, .company-overview-handler").removeClass("shadow-lg p-3 bg-info text-white");
    if (event.target.innerText === "DB portal") {
        let v = $(".db-portal").attr("hidden");
        v ? $(event.target).addClass("shadow-lg p-3 bg-info text-white") : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
        $(".stock-scraper").attr("hidden", true);
        $(".pdf-scraper").attr("hidden", true);
        $(".company-overview").attr("hidden", true);
        $(".financial-report").attr("hidden", true);
        $(".db-portal").attr("hidden", !v).fadeTo("slow", 1);
    }
    if (event.target.innerText === "Stock scraper") {
        let v = $(".stock-scraper").attr("hidden");
        v ? $(event.target).addClass("shadow-lg p-3 bg-info text-white") : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
        $(".db-portal").attr("hidden", true);
        $(".pdf-scraper").attr("hidden", true);
        $(".company-overview").attr("hidden", true);
        $(".financial-report").attr("hidden", true);
        $(".stock-scraper").attr("hidden", !v).fadeTo("slow", 1);
    }
    if (event.target.innerText === "PDF scraper") {
        let v = $(".pdf-scraper").attr("hidden");
        v ? $(event.target).addClass("shadow-lg p-3 bg-info text-white") : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
        $(".db-portal").attr("hidden", true);
        $(".stock-scraper").attr("hidden", true);
        $(".company-overview").attr("hidden", true);
        $(".financial-report").attr("hidden", true);
        $(".pdf-scraper").attr("hidden", !v).fadeTo("slow", 1);
    }
    if (event.target.innerText === "Financial reports") {
        let v = $(".financial-report").attr("hidden");
        v ? $(event.target).addClass("shadow-lg p-3 bg-info text-white") : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
        $(".db-portal").attr("hidden", true);
        $(".stock-scraper").attr("hidden", true);
        $(".pdf-scraper").attr("hidden", true);
        $(".company-overview").attr("hidden", true);
        $(".financial-report").attr("hidden", !v).fadeTo("slow", 1);
    }
    if (event.target.innerText === "Company overview") {
        let v = $(".company-overview").attr("hidden");
        v ? $(event.target).addClass("shadow-lg p-3 bg-info text-white") : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
        $(".db-portal").attr("hidden", true);
        $(".stock-scraper").attr("hidden", true);
        $(".pdf-scraper").attr("hidden", true);
        $(".financial-report").attr("hidden", true);
        $(".company-overview").attr("hidden", !v).fadeTo("slow", 1);
    }
})
//--------------stock scraper---------------
// Add more input fields to scraper
$(".scraper-input-handler").click(function () {
    $("<input class='form-control scraper-input m-2' type='text' name='url' placeholder='location of resource'/>").insertAfter(".scraper-input:last-child");
    event.preventDefault();
})
// Enable/Disable input fields based on selection 
$(".schedule-input-handler").change(function (event) {
    if (event.target.value === "future") {
        $(".schedule-input-future").attr("disabled", false);
        $(".schedule-input-repeat").attr("disabled", true);
    } 
    if (event.target.value === "repeat") {
        $(".schedule-input-repeat").attr("disabled", false);
        $(".schedule-input-future").attr("disabled", true);
    }
    if (event.target.value === "-") {
        $(".schedule-input-repeat").attr("disabled", true);
        $(".schedule-input-future").attr("disabled", true);
    }
})
// set the path to make api request base on selected option
$(".data-source-handler").change(function (event) {
    if (event.target.value === "lse_ftse_100_links") {
        $(".scraper-input").attr("disabled", true);
        $(".scraper-input-handler").attr("disabled", true);
        $(".scraper-input-default").attr("disabled", false);
        $("#stock-scraper-form").attr("action", "/data/lse_ftse_100_links");
        $("#stock-scraper-form").attr("method", "get");
    } else {
        $("#stock-scraper-form").removeAttr("action");
        $("#stock-scraper-form").removeAttr("method");
        $(".scraper-input").attr("disabled", false);
        $(".scraper-input-handler").attr("disabled", false);
    }
})

//--------------PDF scraper---------------
var path;
$(".pdf-scraper-form").submit(function (event) {
    event.preventDefault();
    $(".pdf-text").empty();
    path = $('.pdf-scraper-input').val();
    pdf.app(path, parseInt(num), parseFloat(zoom));
    current_pdf_selection = []; //reset highlighter array
})
// PDF navigation
var num = 1;
$(".pdf-input").change(function () {
    event.preventDefault();
    num = $('.pdf-input').val();
    $(".pdf-text").empty();
    $(".pdf-input").attr("placeholder", num);
    pdf.app(path, parseInt(num), parseFloat(zoom));
    current_pdf_selection = []; //reset highlighter array
})
//PDF zoom
var zoom = 2.0;
$(".pdf-zoom").change(function () {
    event.preventDefault();
    zoom = $('.pdf-zoom').val();
    $(".pdf-text").empty();
    $(".pdf-zoom").attr("placeholder", zoom);
    pdf.app(path, parseInt(num), parseFloat(zoom))
    current_pdf_selection = []; //reset highlighter array
})
//text selector for target building
function innerText_selector(event) {
    //Global innerText selector function
    return (event.target.innerText.trim())
}
var selector_store = [];
var current_pdf_selection = [];
var regex_start;
var regex_end;
// **** grab text by highlighting for regex range
$(".regex-setter-handler").click(function (event) {
    let status = $(".regex-setter-spinner").attr("hidden")
    $(".regex-setter-spinner").attr("hidden", status ? false : true);
    $(".regex-setter-spinner").siblings().text(status ? "stop listening" : "start listening");
    status ? $(".regex-setter-handler").removeClass("btn-warning").addClass("btn-danger") : $(".regex-setter-handler").addClass("btn-warning").removeClass("btn-danger");
    status ? $(".target-controls").prop('disabled', true) : $(".target-controls").prop('disabled', false);
    status ? $(".pdf-text").click(function (event) {
        if (current_pdf_selection.length > 2) {
            $(".pdf-display-selection").empty();
            current_pdf_selection = [];
        } else {
            current_pdf_selection.push(window.getSelection().toString());
            $(".pdf-display-selection").text(`start: ${current_pdf_selection[0]} | end: ${window.getSelection().toString()}`);
        }
        regex_start = current_pdf_selection[0];
        regex_end = current_pdf_selection[1];
    }) : $(".pdf-text").off();
    //view regex extract
    status ? $(".regex-extract-handler").click(function (event) {
        $(".pdf-text").empty();
        let results = pdf.app(path, parseInt(num), parseFloat(zoom), `${regex_start}`, `${regex_end}`);
        $(".pdf-display-selection").text(`${results}`);
        $(".pdf-input-selection").val(`${results}`);
    }) : $(".regex-extract-handler").off();
    //Reset regex
    status ? $(".regex-reset-handler").click(function (event) {
        $(".pdf-display-selection").empty();
        $(".pdf-text").empty();
        pdf.app(path, parseInt(num), parseFloat(zoom));
        current_pdf_selection = [];
    }) : $(".regex-reset-handler").off();
})
// **** grab text by clicking on target
$(".target-setter-handler").click(function (event) {
    let tmp = [];
    let status = $(".target-setter-spinner").attr("hidden");
    $(".target-setter-spinner").attr("hidden", status ? false : true);
    $(".target-setter-spinner").siblings().text(status ? "stop listening" : "start listening");
    status ? $(".target-setter-handler").removeClass("btn-warning").addClass("btn-danger") : $(".target-setter-handler").addClass("btn-warning").removeClass("btn-danger");
    status ? $(".regex-controls").prop('disabled', true) : $(".regex-controls").prop('disabled', false);
    status ? $(".pdf-text").click(function (event) {
        if (tmp.length < 1) {
            $(".pdf-display-selection").text(innerText_selector(event));
            tmp.push(innerText_selector(event))
        } else {
            tmp.push(innerText_selector(event))
            selector_store.push(tmp);
            $(".pdf-display-selection").text(innerText_selector(event));
            tmp = [];
        }
    }) : $(".pdf-text").off();
    // clear previous target array entry 
    status ? $(".target-clear-previous-handler").click(function () {
        let target_removed = selector_store.pop();
        $(".pdf-display-selection").text(`previous [${target_removed}] entry removed`)
    }) : $(".target-clear-previous-handler").off();
    // veiw curent array
    status ? $(".target-view-handler").click(function () {
        $(".pdf-display-selection").text(selector_store.map((e) => `${e}-`));
        $(".pdf-input-selection").val(selector_store.map((e) => `${e}-`));
    }) : $(".target-view-handler").off();
})
// **** Toggle text grabber control
$(".text-grabber-handler").click(function () {
    $(".text-grabber-section").toggle("slow");
})