const { src, watch, series, task, dest, parallel } = require('gulp');
const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchJavascriptAPI(cb) {
    const res = await request(
        'https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Javascript/API'
    );
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

    // const $modifierstate = body.find('#modifierstate').parent();
    // $modifierstate.next().remove();
    // $modifierstate.remove();

    const jsAPI = {};
    const Constants = {};

    // Modify style
    body.find('.standard-table').each((i, elem) => {
        $elem = $(elem);
        const title = $elem.find('th:first-child').html().trim();
        if (title === 'Function') {
            $elem.find('th:first-child').remove();
            $elem.find('td:first-child').remove();

            $elem.find('td:first-child').each((_, child) => {
                let $child = $(child);
                let $code = $child.find('code');
                const signature = $code.html().trim();
                const pointIndex = signature.indexOf('.');
                const leftTokenIndex = signature.indexOf('(');
                const className = signature.substring(0, pointIndex) || '$';
                const funcName = signature.substring(pointIndex + 1, leftTokenIndex);
                const params = signature.substring(leftTokenIndex);

                let list = jsAPI[className];
                if (!list) {
                    list = [];
                    jsAPI[className] = list;
                }
                let desc = $child.siblings('td').html();
                list.push({
                    func: params,
                    name: funcName,
                    return: '',
                    desc: desc ? desc.trim() : '',
                });

                $code.html(
                    `<span class="sign-class">${className}</span>.<span class="sign-func">${funcName}</span>${params}`
                );
            });
        } else if (title === 'Enumerator') {
            $elem.find('td:first-child').each((_, code) => {
                let $code = $(code);
                const enumerator = $code.html().trim();
                const pointIndex = enumerator.indexOf('.');
                const className = enumerator.substring(0, pointIndex);
                const funcName = enumerator.substring(pointIndex + 1);

                let list = Constants[className];
                if (!list) {
                    list = [];
                    Constants[className] = list;
                }
                list.push({
                    value: $code.siblings('td').html().trim(),
                    name: funcName,
                    desc: $code.siblings('td').next().html().trim(),
                });

                $code.html(
                    `<span class="sign-class">${className}</span>.<span class="sign-func">${funcName}</span>`
                );
            });
        }
    });

    jsAPI['Constants'] = Constants;
    await fs.promises.writeFile('./media/javascript_api.json', JSON.stringify(jsAPI, null, '  '));

    // let fileContent = body.html();
    // fileContent = fileContent.replace(/<!--[\s\S]*?-->/g, '');

    // await fs.promises.writeFile("./media/javascript_api.html", fileContent);
    cb();
}

async function fetchPanoramaCSS(cb) {
    const res = await request(
        'https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/CSS_Properties'
    );
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

    let fileContent = body.html();
    fileContent = fileContent.replace(/<!--[\s\S]*?-->/g, '');

    await fs.promises.writeFile('./media/panorama_css.html', fileContent);
    cb();
}

async function fetchAbilitiesDataDriven(cb) {
    const res = await request(
        'https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Abilities_Data_Driven'
    );
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

    let fileContent = body.html();
    fileContent = fileContent.replace(/<!--[\s\S]*?-->/g, '');

    await fs.promises.writeFile('./media/abilities_data_driven.html', fileContent);
    cb();
}

task('default', parallel(fetchJavascriptAPI, fetchPanoramaCSS, fetchAbilitiesDataDriven));

task('docs', require('./generate_docs'));
