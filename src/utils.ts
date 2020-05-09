
let localeData: any = null;

export function loadLocale() {
    if (localeData) {
        return localeData;
    }
    const config = JSON.parse(String(process.env.VSCODE_NLS_CONFIG));
    const locale = config['locale'];
    localeData = require(`../media/i18n/${locale}.json`);
    if (!localeData) {
        localeData = require('../media/i18n/en.json');
    }
    return localeData;
}

export function loadLocaleJSON() {
    return JSON.stringify(localeData);
}