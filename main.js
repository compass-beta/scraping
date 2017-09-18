'use strict'

const cheerio = require('cheerio');
const phantom = require('phantom');

// 'q' means search term
// 'ssrc' means search category - 'a': All, 'e': Restaurants, 'h': Lodgings, 'A': Attractions, 'ac': Tours, 'v': Vacation Rentals, 'g': locations
async function main({q, ssrc='a'}) {
    if (!q) return;

    const options = {
        q: encodeURIComponent(q),
        ssrc: ssrc
    };

    let url = 'https://www.tripadvisor.jp/Search';
    Object.keys(options).forEach((prop, i) => {
        if (!options[prop]) return;
        url += (i === 0 ? '?' : '&');
        url += `${prop}=${options[prop]}`;
    });

    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.open(url);
    const content = await page.property('content');
    await instance.exit();

    const $ = cheerio.load(content);
    const results = [];
    $('.result_wrap').each((i, elem) => {
        const result = {};
        result.title = $(elem).find('.title > span').text();
        result.thumbnail = $(elem).find('.thumbnail img').attr('src');
        result.url = $(elem).attr('onclick').replace(/.*event,'(.*?)'.*/, 'https://www.tripadvisor.jp$1');
        results[i] = result;
    });

    if ($('.pagination-next').hasClass('disabled')) {
        // end
    } else {
        results.push({next: 'continueToken'});
    }

    return results;
}

module.exports = main;
