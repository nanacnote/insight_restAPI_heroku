// Require all dependcies ie mongoose model, scraper app, moments for time format
var scraper = require('../utils/scraper');

// QUERY STRUCTURE ==> ***localhost:port/data/lse_ftse_100_links&token=admin***
exports.lse_ftse_100_links = function(req, res) {
    console.log("lse_100_scrapper started")
    scraper.lse_ftse_100_links(req.query.resource_location)
    .then((data)=> {
        console.log("lse_100_scrapper done")
        data ?
        res.render("success.jade",{
            title: "Successful",
            header: `${ data.length } items collected click on a company link to grab current quote`,
            origin: "london_stock_exchange_constituent_links",
            response: data,
        })
        : res.send("Sorry! error with connection");
    })
}

exports.company_current_quote = function(req, res) {
    var company_current_quote_scraper_status = false;
    if(!company_current_quote_scraper_status){
        company_current_quote_scraper_status = true;
        scraper.lse_company_current_quote(req.query.url)
        .then((data)=> {
            res.send({
                data: data,
            })
        })
        .then(()=>{
            company_current_quote_scraper_status = false;
        })
    }
}