import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class JavascriptAPI {
    private webviewPanel: vscode.WebviewPanel;
    private viewType: string;

    constructor(
        private readonly context: vscode.ExtensionContext,
    ){
        // @ts-ignore
        this.webviewPanel = null;
        this.viewType = `dota2CodingHelper.jsAPI`;
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
            `Dota2 Javascript API`,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                enableFindWidget: true,
            });
        this.renderHTML();
    }

    private async renderHTML() {
        const media = path.join(this.context.extensionPath, 'media');
        const jsAPIPath = path.join(media, 'javascript_api.html');

        const styleUri = this.webviewPanel.webview.asWebviewUri(
            vscode.Uri.file(path.join(media, 'js_api.css'))
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
                ${await fs.promises.readFile(jsAPIPath)}
            </body>
            </html>`;
    }
}