var got = require('got');
var cheerio = require('cheerio');

// promisifying got module
async function got_promise(params) {
    const html = await got(params);
    return html.body;
}

// Scrapper for getting url links for constituents of an index
exports.lse_ftse_100_links = async (url) => {
    const entry_page = await got_promise(url)
    .then((html)=>{
        //_________visual indicator to show progress
        console.log(1)

        const $ = cheerio.load(html);
        let store = [];
        let page_path = $(".page-last").attr("href").slice(0,-1);
        let last_page_number = parseInt($(".page-last").attr("href").match( new RegExp("[0-9]*$", "gi") )[0]);
        $(".blue-text").each(function(i, elem) {
            store.push( `https://www.londonstockexchange.com/${$(this).attr("href")}` );
        });
        return [ store, page_path, last_page_number ]
    })
    .catch((error)=>{
        return [ null, null, null ]
    })
    const entry_page_results = await entry_page;

    async function links_grabber(store=[], page_path=null, last_page_number=null) {
        let newStore = store;
        for(let i = 2; i < last_page_number+1; i++){
            const current_link = await got_promise(`https://www.londonstockexchange.com${page_path}${i}`)
            .then((html)=>{
                const $ = cheerio.load(html);
                $(".blue-text").each(function(i, elem) {
                    newStore.push( `https://www.londonstockexchange.com/${$(this).attr("href")}` );
                });
                return true
            })
            .catch((error)=>{
                newStore.push(error)
                return
            })
            //_________visual indicator to show progress
            console.log(current_link)
        }
        return newStore
    }
    const final_array = await links_grabber(entry_page_results[0], entry_page_results[1], entry_page_results[2]).then((v)=>{return v});
    return final_array;
}

// Scrapper for getting current quote of a company
exports.lse_company_current_quote = async (url) => {
    console.log(1)
    const data = await got_promise(url)
    .then((html)=>{
        const $ = cheerio.load(html);
        console.log(2)
        const quote = {
            ticker_name : $(".ticker-name").text(),
            ticker_description: $(".ticker-description").text(),
            last_price: $(".last-price").text().trim(),
            price_change: $(".price-change").text().trim(),
            open_price: $(".open-last-value").text().split("/")[0].trim(),
            last_close_price: $(".open-last-value").text().split("/")[1].trim(),
            high_price: $(".high-low-value").text().split("/")[0].trim(),
            low_price: $(".high-low-value").text().split("/")[1].trim(),
            bid_price: $(".bid-offer-value").text().split("/")[0].trim(),
            offer_price: $(".bid-offer-value").text().split("/")[1].trim(),
        }
        console.log(3)
        return [quote, $]
    })
    .then((v)=>{
        console.log(4)
        let $ = v[1];
        let quote = v[0];
        //volume
        $("app-index-item, .index-item").each(function(i, elem) {
            if(i ===2){
                quote["volume"] = $(this).children().eq(1).text().trim();
            }
        });
        //turnover
        $("app-index-item, .index-item").each(function(i, elem) {
            if(i ===3){
                quote["turnover"] = $(this).children().eq(1).text().trim();
            }
        });
        //52 week range
        $("app-index-item, .index-item").each(function(i, elem) {
            if(i ===4){
                quote["low_52_week"] = $(this).children().eq(1).text().split("/")[0].trim();
                quote["high_52_week"] = $(this).children().eq(1).text().split("/")[1].trim();
            }
        });
        //YTD
        $("app-index-item, .index-item").each(function(i, elem) {
            if(i ===5){
                quote["ytd"] = $(this).children().eq(1).text().trim();
            }
        });
        //1year return
        $("app-index-item, .index-item").each(function(i, elem) {
            if(i ===6){
                quote["one_year_return"] = $(this).children().eq(1).text().trim();
            }
        });
        //market cap
        $("app-index-item, .index-item").each(function(i, elem) {
            if(i ===7){
                quote["market_cap"] = $(this).children().eq(1).text().trim();
            }
        });
        console.log(5)
        return quote
    })
    .catch((error)=>{
        return "Sorry! error with scraper the url provided may be wrong"
    })
    return data
}
