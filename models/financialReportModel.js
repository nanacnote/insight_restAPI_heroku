var mongoose = require('mongoose');

var Schema = mongoose.Schema;
// Instantiate new schema with type description
var financialReportSchema = new Schema(
    {
        period: {type: String, required: true},
        company_name:{type: String, required: true},
        ticker:{type: String, required: true},
        income_statement:{
            total_revenue: {type: Number, required: true, default: 0},
            cogs: {type: Number, required: true, default: 0},
            operating_expenses:{type: Number, required: true, default: 0},
            depreciation_amortization: {type: Number, default: 0},
            other_operating_expenses: {type: Number, default: 0},
            net_interest_finance: {type: Number, default: 0},
            other_non_operating_income_expense: {type: Number, default: 0},
            taxes: {type: Number, required: true, default: 0},
            attributable_to_non_controlling_interests: {type: Number, default: 0},
            attributable_to_equity_holders_of_parent_company: {type: Number, default: 0},
            earnings_per_share_basic: {type: Number, default: 0},
            earnings_per_share_diluted: {type: Number, default: 0},

        },
        balance_sheet:{
            non_current_assets: {type: Number, required: true, default: 0},
            current_assets: {type: Number, required: true, default: 0},
            non_current_liabilities: {type: Number, required: true, default: 0},
            current_liabilities: {type: Number, required: true, default: 0},
            total_equity: {type: Number, required: true, default: 0},
        },
        cash_flow:{
            operating_activities: {type: Number, default: 0},
            net_cash_from_operating_activities: {type: Number, required: true, default: 0},
            investing_activities: {type: Number, default: 0},
            net_cash_from_investing_activities: {type: Number, required: true, default: 0},
            financing_activities: {type: Number, default: 0},
            net_cash_from_financing_activities: {type: Number, required: true, default: 0},
            cash_and_cash_equivalents_at_start_of_year: {type: Number, required: true, default: 0},
            increase_decrease_in_cash_and_cash_equivalents: {type: Number, required: true, default: 0},
            cash_and_cash_equivalents_at_end_of_year: {type: Number, required: true, default: 0},
        }
    }
);
// Virtual for setting totals
financialReportSchema
    .virtual('calc')
    .get(function () {
        // income statement
        let gross_profit = this.income_statement.total_revenue - this.income_statement.cogs;
        let ebitda = gross_profit - this.income_statement.operating_expenses;
        let ebit = ebitda - this.income_statement.depreciation_amortization;
        let pre_tax_profits = ebit + this.income_statement.net_interest_finance + this.income_statement.other_non_operating_income_expense;
        let net_profit = pre_tax_profits - this.income_statement.taxes;
        // balance_sheet
        let total_assets = this.balance_sheet.current_assets + this.balance_sheet.non_current_assets;
        let total_liabilities = this.balance_sheet.current_liabilities + this.balance_sheet.non_current_liabilities;
        let net_assets = total_assets - total_liabilities;
        // Liquidity Ratios
        let current_ratio = Math.abs(this.balance_sheet.current_assets / this.balance_sheet.current_liabilities);
        let cash_ratio = Math.abs(this.cash_flow.cash_and_cash_equivalents_at_end_of_year / this.balance_sheet.current_liabilities);
        let operating_cash_flow_ratio = Math.abs(this.cash_flow.net_cash_from_operating_activities / this.balance_sheet.current_liabilities);
        // Leverage Financial Ratios
        let debt_ratio = Math.abs(total_liabilities / total_assets);
        let debt_to_equity_ratio = Math.abs(total_liabilities / this.balance_sheet.total_equity);
        let net_interest_coverage_ratio = Math.abs(ebit / this.income_statement.net_interest_finance);
        let debt_service_coverage_ratio = Math.abs(ebit / total_liabilities);
        // Efficiency Ratios
        let asset_turnover_ratio = Math.abs(this.income_statement.total_revenue / total_assets);
        // Profitability Ratios
        let gross_margin_ratio = Math.abs(gross_profit / this.income_statement.total_revenue);
        let operating_margin_ratio = Math.abs(ebit / this.income_statement.total_revenue);
        let return_on_assets_ratio = Math.abs(net_profit / total_assets);
        let return_on_equity_ratio = Math.abs(net_profit / this.balance_sheet.total_equity);
        // Market Value Ratios
        // these are calculated from share price data so the not be served from this schema
        return {
            gross_profit: gross_profit, 
            ebitda: ebitda, 
            ebit: ebit, 
            pre_tax_profits: pre_tax_profits,
            net_profit: net_profit,
            total_assets: total_assets,
            total_liabilities: total_liabilities,
            net_assets: net_assets,
            current_ratio: current_ratio,
            cash_ratio: cash_ratio,
            operating_cash_flow_ratio: operating_cash_flow_ratio,
            debt_ratio: debt_ratio,
            debt_to_equity_ratio: debt_to_equity_ratio,
            net_interest_coverage_ratio: net_interest_coverage_ratio,
            debt_service_coverage_ratio: debt_service_coverage_ratio,
            asset_turnover_ratio: asset_turnover_ratio,
            gross_margin_ratio: gross_margin_ratio,
            operating_margin_ratio: operating_margin_ratio,
            return_on_assets_ratio: return_on_assets_ratio,
            return_on_equity_ratio: return_on_equity_ratio,
        };
    })

// Compile schema into model and export
module.exports = mongoose.model('financialReport', financialReportSchema);






/*
NOTES ON RATIO CALCULATIONS
-----------------------------
Liquidity Ratios
Liquidity ratios are financial ratios that measure a company’s ability to repay both short- and long-term obligations. Common liquidity ratios include the following:

The current ratio measures a company’s ability to pay off short-term liabilities with current assets:

Current ratio = Current assets / Current liabilities

 

The acid-test ratio measures a company’s ability to pay off short-term liabilities with quick assets:

Acid-test ratio = Current assets – Inventories / Current liabilities

 

The cash ratio measures a company’s ability to pay off short-term liabilities with cash and cash equivalents:

Cash ratio = Cash and Cash equivalents / Current Liabilities

 

The operating cash flow ratio is a measure of the number of times a company can pay off current liabilities with the cash generated in a given period:

Operating cash flow ratio = Operating cash flow / Current liabilities


Leverage Financial Ratios
Leverage ratios measure the amount of capital that comes from debt. In other words, leverage financial ratios are used to evaluate a company’s debt levels. Common leverage ratios include the following:

The debt ratio measures the relative amount of a company’s assets that are provided from debt:

Debt ratio = Total liabilities / Total assets

 

The debt to equity ratio calculates the weight of total debt and financial liabilities against shareholders’ equity:

Debt to equity ratio = Total liabilities / Shareholder’s equity

 

The interest coverage ratio shows how easily a company can pay its interest expenses:

Interest coverage ratio = Operating income / Interest expenses

 

The debt service coverage ratio reveals how easily a company can pay its debt obligations:

Debt service coverage ratio = Operating income / Total debt service

 

Efficiency Ratios
Efficiency ratios, also known as activity financial ratios, are used to measure how well a company is utilizing its assets and resources. Common efficiency ratios include:

The asset turnover ratio measures a company’s ability to generate sales from assets:

Asset turnover ratio = Net sales / Total assets

 

The inventory turnover ratio measures how many times a company’s inventory is sold and replaced over a given period:

Inventory turnover ratio = Cost of goods sold / Average inventory

 

The accounts receivable turnover ratio measures how many times a company can turn receivables into cash over a given period:

Receivables turnover ratio = Net credit sales / Average accounts receivable

 

The days sales in inventory ratio measures the average number of days that a company holds on to inventory before selling it to customers:

Days sales in inventory ratio = 365 days / Inventory turnover ratio

 

Profitability Ratios
Profitability ratios measure a company’s ability to generate income relative to revenue, balance sheet assets, operating costs, and equity. Common profitability financial ratios include the following:

The gross margin ratio compares the gross profit of a company to its net sales to show how much profit a company makes after paying its cost of goods sold:

Gross margin ratio = Gross profit / Net sales

 

The operating margin ratio compares the operating income of a company to its net sales to determine operating efficiency:

Operating margin ratio = Operating income / Net sales

 

The return on assets ratio measures how efficiently a company is using its assets to generate profit:

Return on assets ratio = Net income / Total assets

 

The return on equity ratio measures how efficiently a company is using its equity to generate profit:

Return on equity ratio = Net income / Shareholder’s equity

 

Market Value Ratios
Market value ratios are used to evaluate the share price of a company’s stock. Common market value ratios include the following:

The book value per share ratio calculates the per-share value of a company based on equity available to shareholders:

Book value per share ratio = Shareholder’s equity / Total shares outstanding

 

The dividend yield ratio measures the amount of dividends attributed to shareholders relative to the market value per share:

Dividend yield ratio = Dividend per share / Share price

 

The earnings per share ratio measures the amount of net income earned for each share outstanding:

Earnings per share ratio = Net earnings / Total shares outstanding

 

The price-earnings ratio compares a company’s share price to its earnings per share:

Price-earnings ratio = Share price / Earnings per share
*/