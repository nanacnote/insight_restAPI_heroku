// Require all dependcies ie mongoose model, scraper app, moments for time format
var FinancialReport = require('../models/financialReportModel');
var CompanyOverview = require('../models/companyOverviewModel');

// Handle POST queries
// QUERY STRUCTURE ==> ***localhost:port/data/post?function=[eg.london_stock_exchange]&token=admin***
exports.post = function(req, res) {
    switch (req.query.function) {

        // ---------- financial statements ---------------
        case "financial_report":
            let entry_1 = async () => {
                // create schema prototype for db entry
                let doc = await new FinancialReport({
                    period: req.body.period,
                    company_name: req.body.company_name,
                    ticker: req.body.ticker,
                    income_statement:{
                        total_revenue: req.body.total_revenue,
                        cogs: req.body.cogs,
                        operating_expenses:req.body.operating_expenses,
                        depreciation_amortization: req.body.depreciation_amortization,
                        other_operating_expenses: req.body.other_operating_expenses,
                        net_interest_finance: req.body.net_interest_finance,
                        other_non_operating_income_expense: req.body.other_non_operating_income_expense,
                        taxes: req.body.taxes,
                        attributable_to_non_controlling_interests: req.body.attributable_to_non_controlling_interests,
                        attributable_to_equity_holders_of_parent_company: req.body.attributable_to_equity_holders_of_parent_company,
                        earnings_per_share_basic: req.body.earnings_per_share_basic,
                        earnings_per_share_diluted: req.body.earnings_per_share_diluted,

                    },
                    balance_sheet:{
                        non_current_assets: req.body.non_current_assets,
                        current_assets: req.body.current_assets,
                        non_current_liabilities: req.body.non_current_liabilities,
                        current_liabilities: req.body.current_liabilities,
                        total_equity: req.body.total_equity,
                    },
                    cash_flow:{
                        operating_activities: req.body.operating_activities,
                        net_cash_from_operating_activities: req.body.net_cash_from_operating_activities,
                        investing_activities: req.body.investing_activities,
                        net_cash_from_investing_activities: req.body.net_cash_from_investing_activities,
                        financing_activities: req.body.financing_activities,
                        net_cash_from_financing_activities: req.body.net_cash_from_financing_activities,
                        cash_and_cash_equivalents_at_start_of_year: req.body.cash_and_cash_equivalents_at_start_of_year,
                        increase_decrease_in_cash_and_cash_equivalents: req.body.increase_decrease_in_cash_and_cash_equivalents,
                        cash_and_cash_equivalents_at_end_of_year: req.body.cash_and_cash_equivalents_at_end_of_year,
                    }
                })
                return doc
            }
            entry_1()
            .then((doc) => {
                doc.save(function (err) {
                    if (err) {res.send(`Sorry! something went wrong saving to mongodb ${err}`)};
                });
                return doc
            })
            .then((doc)=> {
                res.render("success.jade",{
                    title: "Successful",
                    header:  `${doc.company_name} financial report succesfully added to db`,
                    origin: "financial_report",
                    response: doc,
                })
            })
            break;
        
            
        // ------------ company overview ----------------
        case "company_overview":
            let entry_2 = async () => {
                // create schema prototype for company overview entry
                let doc = await new CompanyOverview({
                    company_name: req.body.company_name,
                    ticker: req.body.ticker,
                    What_does_the_company_do: req.body.What_does_the_company_do,
                    What_sector_is_the_company_in: req.body.What_sector_is_the_company_in,
                    What_region_does_the_company_sell_in: req.body.What_region_does_the_company_sell_in,
                    How_does_the_company_make_money: req.body.How_does_the_company_make_money,
                    Who_are_the_companies_competitors: req.body.Who_are_the_companies_competitors,
                    Who_are_the_companies_leaders: req.body.Who_are_the_companies_leaders,
                    Who_are_the_companies_major_shareholders: req.body.Who_are_the_companies_major_shareholders,
                })
                return doc
            }
            entry_2()
            .then((doc) => {
                doc.save(function (err) {
                    if (err) {res.send(`Sorry! something went wrong saving to mongodb ${err}`)};
                });
                return doc
            })
            .then((doc)=> {
                res.render("success.jade",{
                    title: "Successful",
                    header:  `${doc.company_name} financial report succesfully added to db`,
                    origin: "company_overview",
                    response: [doc],
                })
            })
            break;


        // ---------- end ---------------
        default:
            res.send("Sorry! input controller module could not match request")
            break;
    }
}