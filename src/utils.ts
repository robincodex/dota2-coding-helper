import { existsSync } from "fs";
import { join } from "path";

let localeData: Record<string,any>;
const localeFilePath = join(__dirname,'..','media','i18n');

export function loadLocale(fileName?:string) {
    if (!fileName && localeData) {
        return localeData;
    }
    const config = JSON.parse(String(process.env.VSCODE_NLS_CONFIG));
    const locale = config['locale']
    if(!localeData){
        const common = join(localeFilePath,`${locale}.json`);
        localeData = require(existsSync(common)? common: join(localeFilePath,'en.json'));
        loadLocale('constants')
    }
    if(fileName){
        let localFile = join(localeFilePath,`${fileName+'_'+locale}.json`);
        if(existsSync(localFile)){
            localeData = {...localeData,...require(localFile)};
        }
    }
    return localeData;
}

export function loadLocaleJSON(fileName?:string) {
    if(fileName){
        loadLocale(fileName)
    }
    return JSON.stringify(localeData);
}