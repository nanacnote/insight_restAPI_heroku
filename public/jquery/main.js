var pdf = require("../apps/pdf/pdfViewer");
var $ = require("jquery");

// function to get current user
function getUser() {
  return "nana";
}

// custom function calls from kanban cards
$(document).on('click','.inApp',function(event){
  if($(this).attr("call") === "alert"){
    alert("hurray! this event was created and triggered in App")
  }
  if($(this).attr("call") === "more"){
    $(this).fadeOut("slow").next().attr("hidden", false).children().last().fadeIn("slow")
  }
  if($(this).attr("call") === "less"){
    $(this).fadeOut("slow").parent().attr("hidden", true).prev().fadeIn("slow")
  }
})

// function for current date
function currentDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  return today;
}

// function for on screen alert after action
function screenAlert(params) {
  $("body").after(
    `
              <div class="w-100 screen-alert fixed-bottom">
              <div class="m-5 card alert-warning">
              <div class="card-body">
              <div class="card-text text-center">
              <pre style="font-size: 1.5rem">${params}</pre>
              </div>
              </div>
              </div>
              </div>
              `
  );
  setTimeout(() => {
    $(".screen-alert").fadeOut(function () {
      $(this).remove();
    });
  }, 2000);
}

// --------------TEAM SECTION-------------
// function that returns a kanban card
function kanbanCard(params_1, params_2, params_3, params_4, params_5) {
  //params_1 = content
  //params_2 = date
  //params_3 = user name
  //params_4 = id
  //params_5 = edited
  return `<div class="card kanban-card shadow mb-4 w-100 rounded">
            <div class="card-header alert-info">
            <button type="button" aria-label="Close" class="ml-3 mb-1 close kanban-card-close" identity=${params_4}>
              <i class="far fa-times-circle"></i>
            </button>
            <button type="button" aria-label="Edit" class="ml-2 mb-1 close kanban-card-edit" identity=${params_4}>
              <i class="far fa-edit"></i>
            </button>
            <button type="button" aria-label="Edit" class="ml-2 mb-1 close">
              <i class="far fa-hand-point-right"></i>
            </button>
            <button type="button" aria-label="Edit" class="ml-2 mb-1 close">
              <i class="far fa-hand-point-left"></i>
            </button>
            </div>
            <div class="card-body bg-light">
            <div class="kanban-card-editable-text text-dark" style="overflow-wrap: break-word;">${params_1}</div>
            </div>
            <div class="card-footer bg-light">
            <div class="d-flex justify-content-between">
            <pre class="text-secondary"><strong>Posted &nbsp;</strong>${params_2.match(/[^T]*/g)[0]}<br/><strong>Status &nbsp;</strong>${params_5}</pre>
            <pre class="text-secondary"><strong>By &nbsp;</strong>${params_3}</pre>
            </div>
            </div>
        </div>`;
}

// function that gets all kanbanCards from db
function getAllKanbanCards() {
  // get card data from db
  $.ajax({
    url: "/views?action=getKanbanCards",
    type: "GET",
    data: {},
    success: function (result) {
      let checklist = [];
      let toDo = [];
      let inProgress = [];
      let done = [];

      result.map((e) => {
        let values = Object.values(e);
        values.includes("Checklist")
          ? checklist.push(values)
          : values.includes("To Do")
          ? toDo.push(values)
          : values.includes("In Progress")
          ? inProgress.push(values)
          : values.includes("Done")
          ? done.push(values)
          : null;
      });
      // argument order to pass to kanbanCard function
      // console.log(toDo)
      //params_1 = content
      //params_2 = date
      //params_3 = user name
      //params_4 = id
      //params_5 = edited
      checklist.map((e) => $(".Checklist").after(kanbanCard( e[5], e[2], e[6], e[1], e[0] )));
      toDo.map((e) => $(".To_Do").after(kanbanCard( e[5], e[2], e[6], e[1], e[0] )));
      inProgress.map((e) =>
        $(".In_Progress").after(kanbanCard( e[5], e[2], e[6], e[1], e[0] ))
      );
      done.map((e) => $(".Done").after(kanbanCard( e[5], e[2], e[6], e[1], e[0] )));
    },
  });
}

// function that gets one kanban card from db at the callers this namespace
async function getThisKanbanCard(params) {
  let content
  await $.ajax({
    url: `/views?action=getKanbanCards&id=${params}`,
    type: "GET",
    data: {},
    success: function (result) {
      content = result
    },
  })
  return content
}


// load cards on document ready
$(document).ready(getAllKanbanCards());

// Team management menu controls
$(".team-kanban-handler, .team-calender-handler").click(function (event) {
  // event.preventDefault();
  $(".team-kanban, .team-calender").css("opacity", 0.1);
  $(".team-kanban-handler, .team-calender-handler").removeClass(
    "shadow-lg p-3 bg-info text-white"
  );
  if (event.target.innerText === "Kanban") {
    let v = $(".team-kanban").attr("hidden");
    v
      ? $(event.target).addClass("shadow-lg p-3 bg-info text-white")
      : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
    $(".team-calender").attr("hidden", true);
    $(".team-kanban").attr("hidden", !v).fadeTo("slow", 1);
  }
  if (event.target.innerText === "Calender") {
    let v = $(".team-calender").attr("hidden");
    v
      ? $(event.target).addClass("shadow-lg p-3 bg-info text-white")
      : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
    $(".team-kanban").attr("hidden", true);
    $(".team-calender").attr("hidden", !v).fadeTo("slow", 1);
  }
});

// kanban add
$(".kanban-add").click(function () {
  let that = this;
  $(".kanban-items").map(function (i, e) {
    if (e === that) {
      $($(".kanban-items").get(i + 1)).attr("hidden", false);
    }
  });
});
// kanban dismiss
$(".kanban-dismiss").click(function () {
  let that = this;
  $(".kanban-items").map(function (i, e) {
    if (e === that) {
      $($(".kanban-items").get(i - 2)).attr("hidden", true);
      //clear input field
      $($(".kanban-items").get(i - 1)).children().first().val("")
    }
  });
});
// kanban post
$(".kanban-post").click(function () {
  let clicked = this;
  $(".kanban-items").map(function (i, e) {
    if (e === clicked) {
      let text = $($(".kanban-items").get(i - 2))
        .children()
        .first()
        .val();
      $($(".kanban-items").get(i - 2)).children().first().val("")
      //hide form
      $($(".kanban-items").get(i - 3)).attr("hidden", true)

      // send the cards data to db
      $.ajax({
        url: "/views?action=postKanbanCards",
        type: "POST",
        data: {
          date: new Date(),
          category: "kanbanCard",
          stage: $(clicked).attr("stage"),
          content: text,
          user: getUser(),
          tags: " ",
          extra: " ",
        },
        success: function (result) {
          screenAlert(result);
          //clear the stages and fetch cards again
          $(".kanban-card").each(function (event) {
            $(this).remove()
          })
          getAllKanbanCards()
        },
      });
    }
  });
});

// kanban card delete
$(document).on('click','.kanban-card-close',function(event){
  let identity = $(this).attr("identity")
  $(event.currentTarget).parent()
  .removeClass("alert-info")
  .addClass("bg-danger")
  .html("<pre class='text-white'>marked for deletion</pre>")
  $.ajax({
    url: "/views?action=deleteKanbanCards",
    type: "DELETE",
    data: {
      identity: $(event.currentTarget).attr("identity")
    },
    success: function (result) {
      screenAlert(result);
    },
  });
  $.ajax({
    url: "/views?action=putKanbanCards",
    type: "PUT",
    data: {
      identity: identity,
      edited: "<span class='bg-danger text-light'>marked for deletion</span>"
    },
  });
})

//kanban card edit
$(document).on('click','.kanban-card-edit',async function (event) {
  let identity = $(this).attr("identity")
  let content = await getThisKanbanCard(identity).then(v => v)
  $(this).parent()
  .removeClass("alert-info")
  .addClass("bg-info")
  .html("<pre class='text-white'>in edit mode<li>click on text to edit accept HTML code</li><li>click away to save after</li></pre>")
  .siblings().first()
  .children().first()
  .attr("contenteditable", true)
  .text(content)
  .focusout(function (e) {
    let text = $(e.currentTarget).text().trim()
    $.ajax({
      url: "/views?action=putKanbanCards",
      type: "PUT",
      data: {
        identity: identity,
        content: text,
        edited: "edited"
      },
      success: function (result) {
        screenAlert(result);
        //clear the stages and fetch cards again
        $(".kanban-card").each(function (event) {
          $(this).remove()
        })
        getAllKanbanCards()
      },
    });
  })
})

// --------------DATABASE SECTION
// Menu controls
$(
  ".db-portal-handler, .stock-scraper-handler, .pdf-scraper-handler, .financial-report-handler, .company-overview-handler"
).click(function (event) {
  // event.preventDefault();
  $(
    ".db-portal, .stock-scraper, .pdf-scraper, .financial-report, .company-overview"
  ).css("opacity", 0.1);
  $(
    ".db-portal-handler, .stock-scraper-handler, .pdf-scraper-handler, .financial-report-handler, .company-overview-handler"
  ).removeClass("shadow-lg p-3 bg-info text-white");
  if (event.target.innerText === "DB portal") {
    let v = $(".db-portal").attr("hidden");
    v
      ? $(event.target).addClass("shadow-lg p-3 bg-info text-white")
      : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
    $(".stock-scraper").attr("hidden", true);
    $(".pdf-scraper").attr("hidden", true);
    $(".company-overview").attr("hidden", true);
    $(".financial-report").attr("hidden", true);
    $(".db-portal").attr("hidden", !v).fadeTo("slow", 1);
  }
  if (event.target.innerText === "Stock scraper") {
    let v = $(".stock-scraper").attr("hidden");
    v
      ? $(event.target).addClass("shadow-lg p-3 bg-info text-white")
      : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
    $(".db-portal").attr("hidden", true);
    $(".pdf-scraper").attr("hidden", true);
    $(".company-overview").attr("hidden", true);
    $(".financial-report").attr("hidden", true);
    $(".stock-scraper").attr("hidden", !v).fadeTo("slow", 1);
  }
  if (event.target.innerText === "PDF scraper") {
    let v = $(".pdf-scraper").attr("hidden");
    v
      ? $(event.target).addClass("shadow-lg p-3 bg-info text-white")
      : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
    $(".db-portal").attr("hidden", true);
    $(".stock-scraper").attr("hidden", true);
    $(".company-overview").attr("hidden", true);
    $(".financial-report").attr("hidden", true);
    $(".pdf-scraper").attr("hidden", !v).fadeTo("slow", 1);
  }
  if (event.target.innerText === "Financial reports") {
    let v = $(".financial-report").attr("hidden");
    v
      ? $(event.target).addClass("shadow-lg p-3 bg-info text-white")
      : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
    $(".db-portal").attr("hidden", true);
    $(".stock-scraper").attr("hidden", true);
    $(".pdf-scraper").attr("hidden", true);
    $(".company-overview").attr("hidden", true);
    $(".financial-report").attr("hidden", !v).fadeTo("slow", 1);
  }
  if (event.target.innerText === "Company overview") {
    let v = $(".company-overview").attr("hidden");
    v
      ? $(event.target).addClass("shadow-lg p-3 bg-info text-white")
      : $(event.target).removeClass("shadow-lg p-3 bg-info text-white");
    $(".db-portal").attr("hidden", true);
    $(".stock-scraper").attr("hidden", true);
    $(".pdf-scraper").attr("hidden", true);
    $(".financial-report").attr("hidden", true);
    $(".company-overview").attr("hidden", !v).fadeTo("slow", 1);
  }
});
//--------------stock scraper---------------
// Add more input fields to scraper
$(".scraper-input-handler").click(function () {
  $(
    "<input class='form-control scraper-input m-2' type='text' name='url' placeholder='location of resource'/>"
  ).insertAfter(".scraper-input:last-child");
  event.preventDefault();
});
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
});
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
});

//--------------PDF scraper---------------
var path;
$(".pdf-scraper-form").submit(function (event) {
  event.preventDefault();
  $(".pdf-text").empty();
  path = $(".pdf-scraper-input").val();
  pdf.app(path, parseInt(num), parseFloat(zoom));
  current_pdf_selection = []; //reset highlighter array
});
// PDF navigation
var num = 1;
$(".pdf-input").change(function () {
  event.preventDefault();
  num = $(".pdf-input").val();
  $(".pdf-text").empty();
  $(".pdf-input").attr("placeholder", num);
  pdf.app(path, parseInt(num), parseFloat(zoom));
  current_pdf_selection = []; //reset highlighter array
});
//PDF zoom
var zoom = 2.0;
$(".pdf-zoom").change(function () {
  event.preventDefault();
  zoom = $(".pdf-zoom").val();
  $(".pdf-text").empty();
  $(".pdf-zoom").attr("placeholder", zoom);
  pdf.app(path, parseInt(num), parseFloat(zoom));
  current_pdf_selection = []; //reset highlighter array
});
//text selector for target building
function innerText_selector(event) {
  //Global innerText selector function
  return event.target.innerText.trim();
}
var selector_store = [];
var current_pdf_selection = [];
var regex_start;
var regex_end;
// **** grab text by highlighting for regex range
$(".regex-setter-handler").click(function (event) {
  let status = $(".regex-setter-spinner").attr("hidden");
  $(".regex-setter-spinner").attr("hidden", status ? false : true);
  $(".regex-setter-spinner")
    .siblings()
    .text(status ? "stop listening" : "start listening");
  status
    ? $(".regex-setter-handler")
        .removeClass("btn-warning")
        .addClass("btn-danger")
    : $(".regex-setter-handler")
        .addClass("btn-warning")
        .removeClass("btn-danger");
  status
    ? $(".target-controls").prop("disabled", true)
    : $(".target-controls").prop("disabled", false);
  status
    ? $(".pdf-text").click(function (event) {
        if (current_pdf_selection.length > 2) {
          $(".pdf-display-selection").empty();
          current_pdf_selection = [];
        } else {
          current_pdf_selection.push(window.getSelection().toString());
          $(".pdf-display-selection").text(
            `start: ${
              current_pdf_selection[0]
            } | end: ${window.getSelection().toString()}`
          );
        }
        regex_start = current_pdf_selection[0];
        regex_end = current_pdf_selection[1];
      })
    : $(".pdf-text").off();
  //view regex extract
  status
    ? $(".regex-extract-handler").click(function (event) {
        $(".pdf-text").empty();
        let results = pdf.app(
          path,
          parseInt(num),
          parseFloat(zoom),
          `${regex_start}`,
          `${regex_end}`
        );
        $(".pdf-display-selection").text(`${results}`);
        $(".pdf-input-selection").val(`${results}`);
      })
    : $(".regex-extract-handler").off();
  //Reset regex
  status
    ? $(".regex-reset-handler").click(function (event) {
        $(".pdf-display-selection").empty();
        $(".pdf-text").empty();
        pdf.app(path, parseInt(num), parseFloat(zoom));
        current_pdf_selection = [];
      })
    : $(".regex-reset-handler").off();
});
// **** grab text by clicking on target
$(".target-setter-handler").click(function (event) {
  let tmp = [];
  let status = $(".target-setter-spinner").attr("hidden");
  $(".target-setter-spinner").attr("hidden", status ? false : true);
  $(".target-setter-spinner")
    .siblings()
    .text(status ? "stop listening" : "start listening");
  status
    ? $(".target-setter-handler")
        .removeClass("btn-warning")
        .addClass("btn-danger")
    : $(".target-setter-handler")
        .addClass("btn-warning")
        .removeClass("btn-danger");
  status
    ? $(".regex-controls").prop("disabled", true)
    : $(".regex-controls").prop("disabled", false);
  status
    ? $(".pdf-text").click(function (event) {
        if (tmp.length < 1) {
          $(".pdf-display-selection").text(innerText_selector(event));
          tmp.push(innerText_selector(event));
        } else {
          tmp.push(innerText_selector(event));
          selector_store.push(tmp);
          $(".pdf-display-selection").text(innerText_selector(event));
          tmp = [];
        }
      })
    : $(".pdf-text").off();
  // clear previous target array entry
  status
    ? $(".target-clear-previous-handler").click(function () {
        let target_removed = selector_store.pop();
        $(".pdf-display-selection").text(
          `previous [${target_removed}] entry removed`
        );
      })
    : $(".target-clear-previous-handler").off();
  // veiw curent array
  status
    ? $(".target-view-handler").click(function () {
        $(".pdf-display-selection").text(selector_store.map((e) => `${e}-`));
        $(".pdf-input-selection").val(selector_store.map((e) => `${e}-`));
      })
    : $(".target-view-handler").off();
});
// **** Toggle text grabber control
$(".text-grabber-handler").click(function () {
  $(".text-grabber-section").toggle("slow");
});

//******************************************************************************* */

// DB injection section rendered on new view
// *** restore back into a partial render injection in the future

// boolean indicating if db section is active or inactive
let db_ready_state = $(".db-portal").prop("hidden");

// show all button handler
$(".db-show-all-handler").click(function () {
  // event.preventDefault();
  window.location.href = "/data/dbview?function=show_all&token=admin";
});

// scroll into view // highlight the db tab
$("#db-injection-section").get(0)
  ? $("#db-injection-section").get(0).scrollIntoView()
  : null;
db_ready_state
  ? null
  : $(".db-portal-handler").addClass("shadow-lg p-3 bg-info text-white");

// delete button
$(".db-delete-handler").click(function (event) {
  let el = $(this);
  // all reset
  $(`.db-delete-section-all`).remove();
  $(".db-delete-handler").prop("disabled", false);
  $(`.db-details-section-all`).remove();
  $(".db-details-handler").prop("disabled", false);
  // target activate
  $(this)
    .parent()
    .parent()
    .parent()
    .after(
      `
        <td class="db-delete-section-all db-delete-section-${$(this).prop(
          "id"
        )}" colspan="6">
        <div>
        <button type="button" class="db-delete-abort-handler btn btn-outline-primary btn-lg btn-block">
        abort entry deletion
        </button>
        <button type="button" class="db-delete-confirm-handler btn btn-outline-danger btn-lg btn-block">
        confirm entry deletion
        </button>
        </div>
        </td>
        `
    );
  // scroll into view
  // $(`.db-delete-section-${$(this).prop("id")}`).get(0).scrollIntoView();
  $(this).prop("disabled", true);
  $(".db-delete-abort-handler").click(function () {
    $(`.db-delete-section-${el.prop("id")}`).fadeOut(function () {
      $(this).remove();
    });
    el.prop("disabled", false);
  });
  $(".db-delete-confirm-handler").click(function () {
    let db_deleted_alert = $(event.target).parent().parent().parent().parent();
    $(event.target).parent().parent().parent().remove();
    //this block of code determines what entry to delete in the db based on the attribute
    // named category of the element click which is originally passed to the element at its
    // creation in the jade index html file to serve as an id
    let delete_url;
    if (el.attr("category") === "financial_report") {
      delete_url = `/data/delete?function=financial_report&id=${$(
        event.target
      ).attr("id")}&token=admin`;
    }
    if (el.attr("category") === "company_overview") {
      delete_url = `/data/delete?function=company_overview&id=${$(
        event.target
      ).attr("id")}&token=admin`;
    }
    $.ajax({
      url: delete_url,
      type: "DELETE",
      success: function (result) {
        db_deleted_alert.before(
          `
                    <div class="w-100 db-deleted-feedback fixed-bottom">
                    <div class="m-5 card bg-warning">
                    <div class="card-body">
                    <div class="card-text text-center">
                    <pre>ENTRY WITH ID <span style="border-bottom: solid 5px red; font-size: 1.5rem">${el.attr(
                      "id"
                    )}</span> HAS BEEN PERMANENTLY DELETED</pre>
                    </div>
                    </div>
                    </div>
                    </div>
                    `
        );
        setTimeout(() => {
          $(".db-deleted-feedback").fadeOut(function () {
            $(this).remove();
          });
        }, 2000);
      },
    });
    $(`.db-delete-section-${el.prop("id")}`).fadeOut(function () {
      $(this).remove();
    });
    el.prop("disabled", false);
    $(".db-length").text(`${parseInt($(".db-length").text()) - 1}`);
  });
});

// detail button
$(".db-details-handler").click(function (event) {
  let el = $(this);
  // function to determing what html element to insert in the pop up details section based on attr category
  function details_content(params_1, params_2) {
    let details_data;
    if (params_1 === "financial_report") {
      details_data = `
                <td class="db-details-section-all db-details-section-${params_2.prop(
                  "id"
                )}" colspan="6">
                <div class="alert alert-warning alert-dismissible">
                <h5>Income Statement</h5>
                <pre class="text-wrap">${params_2.attr("is")}</pre>
                <h5>Balance Sheet</h5>
                <pre class="text-wrap">${params_2.attr("bs")}</pre>
                <h5>Cash Flow</h5>
                <pre class="text-wrap">${params_2.attr("cf")}</pre>
                <button type="button" class="close db-details-close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>
                </td>
                `;
    }
    if (params_1 === "company_overview") {
      details_data = `
                <td class="db-details-section-all db-details-section-${params_2.prop(
                  "id"
                )}" colspan="6">
                <div class="alert alert-warning alert-dismissible">
                <h5>Background Information</h5>
                <pre class="text-wrap">${params_2
                  .attr("data")
                  .slice(1, -1)
                  .replace(/\,/g, "\n")}</pre>
                <button type="button" class="close db-details-close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>
                </td>
                `;
    }
    return details_data;
  }
  // all reset
  $(`.db-details-section-all`).remove();
  $(".db-details-handler").prop("disabled", false);
  $(`.db-delete-section-all`).remove();
  $(".db-delete-handler").prop("disabled", false);
  // target activate
  $(this)
    .parent()
    .parent()
    .parent()
    .after(details_content(el.attr("category"), $(this)));
  $(this).prop("disabled", true);
  $(".db-details-close").click(function () {
    $(`.db-details-section-${el.prop("id")}`).fadeOut(function () {
      $(this).remove();
    });
    el.prop("disabled", false);
  });
});

//******************************************************************************* */
var $ = require("jquery");

// SUCCESS PAGE

// global XHR success listener
// $( document ).ajaxSuccess(function( event, xhr, settings ) {
//     console.log( "global ajax successful feedback handler in success.js", xhr.responseText, event, settings );
// });

// home button handler
$(".back-button-handler").click(function () {
  window.history.back();
});

// home button handler
$(".home-button-handler").click(function () {
  window.location.href = "/";
});

// stock scraper success page actions
$(".get-quote-handler").click(function (event) {
  var quote_container = $(this);
  // opens the link to the company page in new tab
  // window.open(
  //     `https://www.londonstockexchange.com/stock/${$(this).attr("path")}`,
  //     '_blank'
  // );
  $.ajax({
    url: "/data/company_current_quote",
    type: "GET",
    data: {
      url: `https://www.londonstockexchange.com/stock/${$(this).attr("path")}`,
    },
    success: function (result) {
      let $q = result.data;
      let performanceColor;
      $q.price_change.charAt(0) == "-"
        ? (performanceColor = "red")
        : (performanceColor = "green");

      $(`.quote-section-${quote_container.attr("key")}`).after(
        `
                <div class="container-fluid mb-3">

                <div class="row">

                <div class="card bg-light m-2" style="width: 12rem; border-top: solid 10px ${performanceColor}">
                <div class="card-body">
                <h6 class="card-title"><strong>${$q.ticker_name}</strong></h6>
                <p class="card-text">${$q.ticker_description}</p>
                <h6 class="card-title"><strong>Market Cap</strong></h6>
                <p class="card-text">${$q.market_cap}</p>
                </div>
                </div>

                <div class="card bg-light m-2" style="width: 12rem; border-top: solid 10px ${performanceColor}">
                <div class="card-body">
                <h6 class="card-title"><strong>Current Price</strong></h6>
                <p class="card-text">${$q.last_price}</p>
                <h6 class="card-title"><strong>Price Change</strong></h6>
                <p class="card-text">${$q.price_change}</p>
                </div>
                </div>
                
                <div class="card bg-light m-2" style="width: 12rem; border-top: solid 10px ${performanceColor}">
                <div class="card-body">
                <h6 class="card-title"><strong>Turnover</strong></h6>
                <p class="card-text">${$q.turnover}</p>
                <h6 class="card-title"><strong>Volume</strong></h6>
                <p class="card-text">${$q.volume}</p>
                </div>
                </div>

                <div class="card bg-light m-2" style="width: 12rem; border-top: solid 10px ${performanceColor}">
                <div class="card-body">
                <h6 class="card-title"><strong>Last Close Price</strong></h6>
                <p class="card-text">${$q.last_close_price}</p>
                <h6 class="card-title"><strong>Open Price</strong></h6>
                <p class="card-text">${$q.open_price}</p>
                </div>
                </div>
                
                <div class="card bg-light m-2" style="width: 12rem; border-top: solid 10px ${performanceColor}">
                <div class="card-body">
                <h6 class="card-title"><strong>High</strong></h6>
                <p class="card-text">${$q.high_price}</p>
                <h6 class="card-title"><strong>Low</strong></h6>
                <p class="card-text">${$q.low_price}</p>
                </div>
                </div>
                
                <div class="card bg-light m-2" style="width: 12rem; border-top: solid 10px ${performanceColor}">
                <div class="card-body">
                <h6 class="card-title"><strong>Bid</strong></h6>
                <p class="card-text">${$q.bid_price}</p>
                <h6 class="card-title"><strong>Offer</strong></h6>
                <p class="card-text">${$q.offer_price}</p>
                </div>
                </div>

                <div class="card bg-light m-2" style="width: 12rem; border-top: solid 10px ${performanceColor}">
                <div class="card-body">
                <h6 class="card-title"><strong>52 week high</strong></h6>
                <p class="card-text">${$q.high_52_week} </p>
                <h6 class="card-title"><strong>52 week low</strong></h6>
                <p class="card-text">${$q.low_52_week} </p>
                </div>
                </div>

                <div class="card bg-light m-2" style="width: 12rem; border-top: solid 10px ${performanceColor}">
                <div class="card-body">
                <h6 class="card-title"><strong>1 year return</strong></h6>
                <p class="card-text">${$q.one_year_return} </p>
                <h6 class="card-title"><strong>Year to date</strong></h6>
                <p class="card-text">${$q.ytd} </p>
                </div>
                </div>

                </div>

                </div>
                `
      );
    },
  });
});
