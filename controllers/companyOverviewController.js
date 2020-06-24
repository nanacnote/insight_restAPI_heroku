// Set up mongoose model for db interfacing 
var FinancialReport = require('../models/financialReportModel');
var CompanyOverview = require('../models/companyOverviewModel');

// QUERY STRUCTURE ==> ***localhost:port/data/[eg all_companies]?period=[year]&ticker=[abc]&key=[123]***
exports.all_companies = function (req, res) {
    FinancialReport.find({period: req.query.period})
    .sort("company_name")
    .exec(
        function (err, doc) {
            try {
                let store = {};
                doc.map((e)=>{
                    store[e["ticker"]]=e["company_name"]
                })
                res.send(store);
            } catch (error) {
                res.send({"statement": "Sorry! trouble fetching data. Please refresh the page"});
            }
        }
    ) 
};

exports.company_overview = function (req, res) {
    CompanyOverview.findOne({
        ticker: req.query.ticker,
    }, function (err, doc) {
        try {
            res.send(doc);
        } catch (error) {
            res.send({"statement": "Sorry! trouble fetching data. Please refresh the page"});
        }
    })
};