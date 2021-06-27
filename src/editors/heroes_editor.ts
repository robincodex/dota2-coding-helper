import { type } from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { GetNonce, writeDocument, RequestHelper, locale } from './utils';

export class CustomGameSettingsService {
    private request: RequestHelper;

    constructor(private readonly context: vscode.ExtensionContext) {
        this.request = new RequestHelper();
    }

    /**
     * When editor is opened
     * @param document
     * @param webviewPanel
     * @param _token
     */
    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = await this.getHTML(webviewPanel.webview);

        // send a text to webview
        const updateData = async () => {
            webviewPanel.webview.postMessage({
                label: 'update',
                text: '',
            });
        };

        const onChangeDocument = vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.contentChanges.length <= 0) {
                return;
            }
            if (e.document.uri.toString() === document.uri.toString()) {
                updateData();
            }
        });

        webviewPanel.onDidDispose(() => {
            this.request.clear();
            onChangeDocument.dispose();
        });

        webviewPanel.webview.onDidReceiveMessage((ev: any) => {
            this.request.onRequest(ev, webviewPanel.webview);
        });

        // Initialize it if it is empty text
        if (document.getText().trim().length === 0) {
            writeDocument(document, `"DOTAHeroes"\n{\n}`);
            return;
        }

        const activelistWatcher = vscode.workspace.createFileSystemWatcher(
            '**/scripts/npc/{activelist.txt,herolist.txt}',
            false,
            false,
            false
        );

        updateData();
    }

    /**
     * Return HTML content
     * @param webview
     */
    private async getHTML(webview: vscode.Webview): Promise<string> {
        const nonce = GetNonce();

        const styleUri = webview.asWebviewUri(
            vscode.Uri.file(path.join(this.context.extensionPath, 'media/bundle/style.css'))
        );

        const indexJs = webview.asWebviewUri(
            vscode.Uri.file(
                path.join(this.context.extensionPath, 'media/bundle/CustomGameSettings.js')
            )
        );

        // prettier-ignore
        return `
            <!DOCTYPE html>
            <html lang="${locale()}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title></title>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src 'nonce-${nonce}' ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <link href="${styleUri}" nonce="${nonce}" rel="stylesheet" />
                <script nonce="${nonce}">window._nonce_ = "${nonce}"</script>
                <script nonce="${nonce}" type="module" src="${indexJs}" defer></script>
            </head>
            <body class="code-block">
                <div id="app" />
            </body>
            </html>
        `;
    }
}

export class CustomGameSettingsProvider implements vscode.CustomTextEditorProvider {
    private static readonly viewType = 'dota2CodingHelper.editCustomGameSettings';

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new CustomGameSettingsProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(
            CustomGameSettingsProvider.viewType,
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
            }
        );
        return providerRegistration;
    }

    constructor(private readonly context: vscode.ExtensionContext) {}

    /**
     * When editor is opened
     * @param document
     * @param webviewPanel
     * @param _token
     */
    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        const service = new CustomGameSettingsService(this.context);
        await service.resolveCustomTextEditor(document, webviewPanel, _token);
    }
}
