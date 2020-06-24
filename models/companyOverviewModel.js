var mongoose = require('mongoose');

var Schema = mongoose.Schema;
// Instantiate new schema with type description
var companyOverviewSchema = new Schema(
  {
    company_name: {type: String, required: true},
    ticker: {type: String, required: true},
    What_does_the_company_do: {type: String, required: true},
    What_sector_is_the_company_in: {type: String, required: true},
    What_region_does_the_company_sell_in: {type: String, required: true},
    How_does_the_company_make_money: {type: String, required: true},
    Who_are_the_companies_competitors: {type: String, required: true},
    Who_are_the_companies_leaders: {type: String, required: true},
    Who_are_the_companies_major_shareholders: {type: String, required: true},
  }
)
// Compile schema into model and export
module.exports = mongoose.model('companyOverview', companyOverviewSchema);