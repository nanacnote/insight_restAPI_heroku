// SUCCESS PAGE

// global XHR success listener
// $( document ).ajaxSuccess(function( event, xhr, settings ) {
//     console.log( "global ajax successful feedback handler in success.js", xhr.responseText, event, settings );
// });

// home button handler
$(".back-button-handler").click(function () {
    window.history.back();
})

// home button handler
$(".home-button-handler").click(function () {
    window.location.href = "/";
})

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
        success: function(result) {
            let $q = result.data;
            let performanceColor;
            $q.price_change.charAt(0) == "-" ? performanceColor = "red" : performanceColor = "green";

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
        }
    })
})