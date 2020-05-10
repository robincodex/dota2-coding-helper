import * as vscode from 'vscode';
import { LuaAPI } from './lua_api_service';
import { loadLocale } from './utils';
import { JavascriptAPI } from './js_api_service';
import { PanoramaCSS } from './panorama_css';

export function activate(context: vscode.ExtensionContext) {
    loadLocale();
    context.subscriptions.push((new LuaAPI(context, false)).register());
    context.subscriptions.push((new LuaAPI(context, true)).register());
    context.subscriptions.push((new JavascriptAPI(context)).register());
    context.subscriptions.push((new PanoramaCSS(context)).register());
}

export function deactivate() {}
