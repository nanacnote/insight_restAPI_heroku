// Require all dependcies ie mongoose model
var FinancialReport = require('../models/financialReportModel');
var CompanyOverview = require('../models/companyOverviewModel');

// Handle DELETE queries
// QUERY STRUCTURE ==> ***localhost:port/data/delete?function=[eg. stock_quotes]&ticker=[eg ABC]token=admin***
exports.delete = function(req, res) {
    switch (req.query.function) {
        // ------------ stock quotes ----------------
        case "financial_report":
            FinancialReport.deleteOne({ _id: req.query.id }, function (err, doc) {
                res.send(true);
            });
            break;

        // ---------- financial statements ---------------
        case "company_overview":
            CompanyOverview.deleteOne({ _id: req.query.id }, function (err, doc) {
                res.send(true);
            });
            break;

        // ---------- end ---------------
        default:
            res.send("Sorry! delete controller module could not match request")
            break;
    }
}