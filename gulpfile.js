const { src, watch, series, task, dest, parallel } = require('gulp');
const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchJavascriptAPI(cb) {
    const res = await request("https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Javascript/API");
    // const res = await fs.promises.readFile('I:/web/API - Valve Developer Community.html');
    const $ = cheerio.load(res);
    const body = $('div#content');
    body.find('h1#firstHeading').remove();
    body.find('div#contentSub').remove();
    body.find('div#jump-to-nav').remove();
    body.find('#toctitle .toctoggle').remove();
    body.find('#bodyContent > div:last-child').remove();
    body.find('#bodyContent > div:last-child').remove();
    body.find('#bodyContent > div:last-child').remove();
    body.find('#siteSub').html('Copy From Valve Developer Community');
    body.find('.mw-indicators').remove();

    const mwContentText = body.find('#mw-content-text > div:first-child');
    if (!mwContentText.attr('id')) {
        mwContentText.remove();
    }

    const $modifierfunction = body.find('#modifierfunction').parent();
    $modifierfunction.next().remove();
    $modifierfunction.remove();

    const $modifierstate = body.find('#modifierstate').parent();
    $modifierstate.next().remove();
    $modifierstate.remove();

    // Modify style
    body.find(".standard-table").each((i, elem) => {
        $elem = $(elem);
        const title = $elem.find("th:first-child").html().trim();
        if (title === 'Function') {
            $elem.find("th:first-child").remove();
            $elem.find("td:first-child").remove();

            $elem.find("td:first-child code").each((_, code) => {
                const signature = $(code).html().trim();
                const pointIndex = signature.indexOf(".");
                const leftTokenIndex = signature.indexOf("(");
                const className = signature.substring(0, pointIndex) || '$';
                const funcName = signature.substring(pointIndex+1, leftTokenIndex);
                const params = signature.substring(leftTokenIndex);
                $(code).html(`<span class="sign-class">${className}</span>.<span class="sign-func">${funcName}</span>${params}`);
            });
        }
        else if (title === 'Enumerator') {
            $elem.find("td:first-child").each((_, code) => {
                const enumerator = $(code).html().trim();
                const pointIndex = enumerator.indexOf(".");
                const className = enumerator.substring(0, pointIndex);
                const funcName = enumerator.substring(pointIndex+1);
                $(code).html(`<span class="sign-class">${className}</span>.<span class="sign-func">${funcName}</span>`);
            });
        }
    });

    await fs.promises.writeFile("./media/javascript_api.html", body.html());
    cb();
}

async function fetchPanoramaCSS(cb) {
    const res = await request("https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/CSS_Properties");
    const $ = cheerio.load(res);
    const body = $('div#content');
    body.find('h1#firstHeading').remove();
    body.find('div#contentSub').remove();
    body.find('div#jump-to-nav').remove();
    body.find('#toctitle .toctoggle').remove();
    body.find('#bodyContent > div:last-child').remove();
    body.find('#bodyContent > div:last-child').remove();
    body.find('#bodyContent > div:last-child').remove();
    body.find('#siteSub').html('Copy From Valve Developer Community');
    body.find('.mw-indicators').remove();

    const mwContentText = body.find('#mw-content-text > div:first-child');
    if (!mwContentText.attr('id')) {
        mwContentText.remove();
    }

    await fs.promises.writeFile("./media/panorama_css.html", body.html());
    cb();
}

async function fetchAbilitiesDataDriven(cb) {
    const res = await request("https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Abilities_Data_Driven");
    const $ = cheerio.load(res);
    const body = $('div#content');
    body.find('h1#firstHeading').remove();
    body.find('div#contentSub').remove();
    body.find('div#jump-to-nav').remove();
    body.find('#toctitle .toctoggle').remove();
    body.find('#bodyContent > div:last-child').remove();
    body.find('#bodyContent > div:last-child').remove();
    body.find('#bodyContent > div:last-child').remove();
    body.find('#siteSub').html('Copy From Valve Developer Community');
    body.find('.mw-indicators').remove();
    
    const mwContentText = body.find('#mw-content-text > div:first-child');
    if (!mwContentText.attr('id')) {
        mwContentText.remove();
    }

    await fs.promises.writeFile("./media/abilities_data_driven.html", body.html());
    cb();
}

task("default", parallel(
    fetchJavascriptAPI,
    fetchPanoramaCSS,
    fetchAbilitiesDataDriven
));

task("docs", require('./generate_docs'));