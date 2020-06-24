// Set up mongoose model for db interfacing 
var FinancialReport = require('../models/financialReportModel');

// QUERY STRUCTURE ==> ***localhost:port/data/[type of statement]?period=[year]&ticker=[abc]&key=[123]***
exports.all_statements = function (req, res) {
    FinancialReport.findOne({
        ticker: req.query.ticker,
        period: req.query.period,
    }, function (err, doc) {
        try {
            res.send({"statement": doc, "ratios": doc.calc});
        } catch (error) {
            res.send({"statement": "Sorry! check your query again"})
        }
    })
};

exports.income_statement = function (req, res) {
    FinancialReport.findOne({
        ticker: req.query.ticker,
        period: req.query.period,
    }, function (err, doc) {
        try {
            res.send({"statement": doc.income_statement, "ratios": doc.calc});
        } catch (error) {
            res.send({"statement": "Sorry! check your query again"})
        }
    })
};

exports.balance_sheet = function (req, res) {
    FinancialReport.findOne({
        ticker: req.query.ticker,
        period: req.query.period,
    }, function (err, doc) {
        try {
            res.send({"statement": doc.balance_sheet, "ratios": doc.calc});
        } catch (error) {
            res.send({"statement": "Sorry! check your query again"})
        }
    })
};

exports.cash_flow = function (req, res) {
    FinancialReport.findOne({
        ticker: req.query.ticker,
        period: req.query.period,
    }, function (err, doc) {
        try {
            res.send({"statement": doc.cash_flow, "ratios": doc.calc});
        } catch (error) {
            res.send({"statement": "Sorry! check your query again"})
        }
    })
};