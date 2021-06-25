
let localeData: Record<string,any>;

export function loadLocale() {
    if (localeData) {
        return localeData;
    }
    const config = JSON.parse(String(process.env.VSCODE_NLS_CONFIG));
    const locale = config['locale'];
    localeData = require(`../media/i18n/${locale}.json`);
    if(!localeData) {
        localeData = require('../media/i18n/en.json');
    }
    let constants = require(`../media/i18n/constants_${locale}.json`);
    if( constants){
        localeData = {...localeData,...constants};
    }
    return localeData;
}

export function loadLocaleJSON(fileName?:string) {
    if(fileName){
        const config = JSON.parse(String(process.env.VSCODE_NLS_CONFIG));
        const locale = config['locale'];
        let localFile = require(`../media/i18n/${fileName}_${locale}.json`);
        if(localFile){
            localeData = {...localeData,...localFile};
        }
    }
    return JSON.stringify(localeData);
}