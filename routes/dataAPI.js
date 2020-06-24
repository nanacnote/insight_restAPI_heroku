var express = require('express');
var router = express.Router();

// Require controller modules
var postController = require('../controllers/postController');
var deleteController = require('../controllers/deleteController');
var dbViewController = require('../controllers/dbViewController');
var companyOverviewController = require('../controllers/companyOverviewController');
var financialReportController = require('../controllers/financialReportController');
var stockQuoteController = require('../controllers/stockQuoteController');

/// POST DELETE ROUTES ///
/// __________________ ///
router.post('/post', postController.post);
router.delete('/delete', deleteController.delete);

/// VIEW DB ROUTES ///
/// __________________ ///
router.get('/dbview', dbViewController.show);

/// COMPANY OVERVIEW ROUTES ///
/// __________________________ ///
router.get('/all_companies', companyOverviewController.all_companies);
router.get('/company_overview', companyOverviewController.company_overview);

/// FINANCIAL STATEMENTS ROUTES ///
/// __________________________ ///
router.get('/all_statements', financialReportController.all_statements);
router.get('/income_statement', financialReportController.income_statement);
router.get('/balance_sheet', financialReportController.balance_sheet);
router.get('/cash_flow', financialReportController.cash_flow);

/// STOCK QUOTES ROUTES ///
/// __________________ ///
router.get('/lse_ftse_100_links', stockQuoteController.lse_ftse_100_links);
router.get('/company_current_quote', stockQuoteController.company_current_quote );

module.exports = router;