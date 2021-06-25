import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { loadLocaleJSON } from './utils';

export class API {
    private webviewPanel: vscode.WebviewPanel;
    private viewType: string;

    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly pathName: string,
    ) {
        // @ts-ignore
        this.webviewPanel = null;
        this.viewType = `dota2CodingHelper.${pathName}API`;
    }

    public register() {
        return vscode.commands.registerCommand(
            this.viewType,
            this.start.bind(this),
        );
    }

    private start(): void {
        this.webviewPanel = vscode.window.createWebviewPanel(
            this.viewType,
            `Dota2 ${this.pathName} API`,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
        this.renderHTML();
    }

    private renderHTML() {
        const media = path.join(this.context.extensionPath, 'media');

        const jsUri = this.webviewPanel.webview.asWebviewUri(
            vscode.Uri.file(path.join(media, 'lua_api.js'))
        );

        const styleUri = this.webviewPanel.webview.asWebviewUri(
            vscode.Uri.file(path.join(media, 'lua_api.css'))
        );

        const apiUri = this.webviewPanel.webview.asWebviewUri(
            vscode.Uri.file(path.join(media, `api_${this.pathName}.json`))
        );

        this.webviewPanel.webview.html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Dota2 Coding Helper</title>
                <link href="${styleUri}" rel="stylesheet" />
            </head>
            <body>
                <div id="root"></div>
                <script>
                    window.apiUri = "${apiUri}";
                    window.localeData = ${loadLocaleJSON()};
                    window.usingJavascriptStyle = ${this.pathName==='js'};
                </script>
                <script src="${jsUri}"></script>
            </body>
            </html>`;
    }
}