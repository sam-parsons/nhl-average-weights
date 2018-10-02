const rp = require('request-promise');
const $ = require('cheerio');
const nhlParse = require('./nhlParse');
const url = 'https://www.nhl.com/info/teams';

rp(url)
  .then(function(html) {
    //success!

    // start here
    const len = $('.ticket-team', html).length;
    const nhlUrls = [];
    for (let i = 0; i < $('.ticket-link_link', html).length; i ++) {
        if (i % 5 == 1) {
            nhlUrls.push($('.ticket-link_link', html)[i]);
        }
    }
    for (let i = 0; i < nhlUrls.length-1; i++) { // -1 = Vegas incorrect format
        // go to site and find average weight
        rp('https://www.nhl.com' + nhlUrls[i].attribs.href)
            .then(function(html) {
                // success

                const button = $('#teamSelect', html);
                console.log(button['0'].children[0].data.trim());

                const temp = $('td[class="weight-col fixed-width-font"]', html);
                let sum = 0;
                let avg = 0;
                
                for (let j = 0; j < temp.length; j++) {
                    sum += parseInt(temp[j].children[0].data);
                }
                avg = Math.floor(sum/temp.length);
                console.log("Average weight: ", avg);
            })
            .catch(function(err) {
                console.log(err);
            })
    }
  })
  .catch(function(err) {
    //handle error
    console.log(err);
  });