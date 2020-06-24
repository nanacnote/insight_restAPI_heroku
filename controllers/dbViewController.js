var FinancialReport = require('../models/financialReportModel');
var CompanyOverview = require('../models/companyOverviewModel');


// Handle DBVIEW queries
// QUERY STRUCTURE ==> ***localhost:port/view/post?function=[eg.show_all]&token=admin***
exports.show = function(req, res) {
    switch (req.query.function) {
        // ------------ show all ----------------
        case "show_all":
            var store_1 = [];
            var store_2 = [];
            let data = async ()=>{
                await FinancialReport.find({}, function (err, doc) {
                    // confirm that mongoose found an entry so dependencies will not throw error
                    if(doc[0]){
                        let tmp =[];
                        doc.forEach((el)=>{
                            tmp.push([JSON.stringify(el._id), JSON.stringify(el.ticker), JSON.stringify(el.company_name), JSON.stringify(el.period), el]);
                        })
                        store_1.push(tmp);
                    } else{
                        store_1.push([]);
                    }
                })
                await CompanyOverview.find({}, function (err, doc) {
                    if(doc[0]){
                        let tmp =[];
                        doc.forEach((el)=>{
                            tmp.push([ el._id, el.ticker, el.company_name, el ]);
                        })
                        store_2.push(tmp);
                    } else{
                        store_2.push([]);
                    }
                })
            }
            data()
            .then(()=>{
                store_1[0] && store_2[0]?
                res.render("index.jade",{
                    layout: false,
                    title: "Insight",
                    injection: true,
                    type: "All Database Entries",
                    length: store_1[0].length + store_2[0].length,
                    FinancialReport: store_1[0],
                    CompanyOverview: store_2[0],
                })
                :
                res.send("Sorry! something went wrong please refresh");
            })
            .catch(function(e) {
                res.render("index.jade",{
                    title: "Insight",
                    injection: true,
                    type: "All Database Entries",
                    length: 0,
                    response: {"err": "Sorry! try again mongoose failed to retrieve all entries"},
                })
            })
            break;

        // ------------ show colletions ----------------
        case "show_financial_report":
            res.send("coming soon")
            
            break;

        // ------------ show documents ----------------
            case "show_stock_prices":
                res.send("coming soon")
                
                break;
        
        // ---------- end ---------------
        default:
            res.send("Sorry! input controller module could not match request")
            break;
    }
}