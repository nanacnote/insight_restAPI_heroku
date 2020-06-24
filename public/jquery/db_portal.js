// DB injection section rendered on new view 
// *** restore back into a partial render injection in the future

// boolean indicating if db section is active or inactive
let db_ready_state = $(".db-portal").prop("hidden");

// show all button handler
$(".db-show-all-handler").click(function () {
    // event.preventDefault();
    window.location.href = "/data/dbview?function=show_all&token=admin";
})

// scroll into view // highlight the db tab
$("#db-injection-section").get(0) ? $("#db-injection-section").get(0).scrollIntoView() : null;
db_ready_state ? null : $(".db-portal-handler").addClass("shadow-lg p-3 bg-info text-white");;

// delete button
$(".db-delete-handler").click(function (event) {
    let el = $(this);
    // all reset
    $(`.db-delete-section-all`).remove();
    $(".db-delete-handler").prop("disabled", false);
    $(`.db-details-section-all`).remove();
    $(".db-details-handler").prop("disabled", false);
    // target activate
    $(this).parent().parent().parent().after(
        `
        <td class="db-delete-section-all db-delete-section-${$(this).prop("id")}" colspan="6">
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
    )
    // scroll into view
    // $(`.db-delete-section-${$(this).prop("id")}`).get(0).scrollIntoView();
    $(this).prop("disabled", true);
    $(".db-delete-abort-handler").click(function () {
        $(`.db-delete-section-${el.prop("id")}`).fadeOut(function () {
            $(this).remove()
        });
        el.prop("disabled", false);
    });
    $(".db-delete-confirm-handler").click(function () {
        let db_deleted_alert = $(event.target).parent().parent().parent().parent()
        $(event.target).parent().parent().parent().remove()
        //this block of code determines what entry to delete in the db based on the attribute 
        // named category of the element click which is originally passed to the element at its 
        // creation in the jade index html file to serve as an id
        let delete_url;
        if (el.attr("category") === "financial_report") {
            delete_url = `/data/delete?function=financial_report&id=${$(event.target).attr("id")}&token=admin`
        }
        if (el.attr("category") === "company_overview") {
            delete_url = `/data/delete?function=company_overview&id=${$(event.target).attr("id")}&token=admin`
        }
        $.ajax({
            url: delete_url,
            type: "DELETE",
            success: function(result) {
                db_deleted_alert.before(
                    `
                    <div class="w-100 db-deleted-feedback fixed-bottom">
                    <div class="m-5 card bg-warning">
                    <div class="card-body">
                    <div class="card-text text-center">
                    <pre>ENTRY WITH ID <span style="border-bottom: solid 5px red; font-size: 1.5rem">${el.attr("id")}</span> HAS BEEN PERMANENTLY DELETED</pre>
                    </div>
                    </div>
                    </div>
                    </div>
                    `
                );
                setTimeout(() => {
                    $(".db-deleted-feedback").fadeOut(function () {
                        $(this).remove()
                    });
                }, 2000);
            }
        });
        $(`.db-delete-section-${el.prop("id")}`).fadeOut(function () {
            $(this).remove()
        });
        el.prop("disabled", false);
        $(".db-length").text(`${ parseInt($(".db-length").text())- 1 }`)
    });
});

// detail button
$(".db-details-handler").click(function (event) {
    let el = $(this);
    // function to determing what html element to insert in the pop up details section based on attr category 
    function details_content(params_1, params_2) {
        let details_data;
        if( params_1 === "financial_report" ){
            details_data = (
                `
                <td class="db-details-section-all db-details-section-${params_2.prop("id")}" colspan="6">
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
                `
            )
        }
        if( params_1 === "company_overview" ){
            details_data = (
                `
                <td class="db-details-section-all db-details-section-${params_2.prop("id")}" colspan="6">
                <div class="alert alert-warning alert-dismissible">
                <h5>Background Information</h5>
                <pre class="text-wrap">${params_2.attr("data").slice(1,-1).replace(/\,/g,"\n")}</pre>
                <button type="button" class="close db-details-close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>
                </td>
                `
            )
        }
        return details_data
    }
    // all reset
    $(`.db-details-section-all`).remove()
    $(".db-details-handler").prop("disabled", false);
    $(`.db-delete-section-all`).remove()
    $(".db-delete-handler").prop("disabled", false);
    // target activate
    $(this).parent().parent().parent().after( details_content( el.attr("category"), $(this) ) );
    $(this).prop("disabled", true);
    $(".db-details-close").click(function () {
        $(`.db-details-section-${el.prop("id")}`).fadeOut(function () {
            $(this).remove()
        });
        el.prop("disabled", false);
    })
});

