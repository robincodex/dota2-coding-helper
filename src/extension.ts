import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('dota2CodingHelper.luaServerAPI', () => {
        const panel = vscode.window.createWebviewPanel(
            "dota2CodingHelper.luaServerAPI",
            "Dota2 Lua Server API",
            vscode.ViewColumn.One,
            {});
        panel.webview.html = getWebviewContent();
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
    </head>
    <body>
        <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    </body>
    </html>`;
}

export function deactivate() {}
