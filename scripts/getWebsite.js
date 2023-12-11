const scrape = require('website-scraper');
const options = {
  urls: ['https://webstage7a.smartone.com/tc/home/'],
  directory: './template'
};

// with promise
scrape(options).then((result) => {
    console.log(result)
});