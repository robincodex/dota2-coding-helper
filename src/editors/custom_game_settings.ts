import { type } from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { GetNonce, writeDocument, RequestHelper, locale } from './utils';

interface GameAPI {
    Namespace: string;
    FuncName: string;
    Params: string[];
}

interface GameAPIChangeEvent<T> extends GameAPI {
    value: T;
}

export type { GameAPI, GameAPIChangeEvent };

export class CustomGameSettingsService {
    private request: RequestHelper;
    private apiList: GameAPI[];

    constructor(private readonly context: vscode.ExtensionContext) {
        this.request = new RequestHelper();
        this.apiList = [];
    }

    /**
     * 解析代码
     */
    private parseCode(text: string) {
        const lines = text.match(/^(GameRules:|GameMode:)[\w\d_]+\(.+\);?$/gm);
        const apiList: GameAPI[] = [];
        if (!lines) {
            return apiList;
        }
        for (const line of lines) {
            let a = line.indexOf(':');
            let b = line.indexOf('(');
            let c = line.lastIndexOf(')');
            let Namespace = line.slice(0, a).trim();
            let FuncName = line.slice(a + 1, b).trim();
            let Params: string[] = line
                .slice(b + 1, c)
                .split(',')
                .map((v) => v.trim());
            apiList.push({ Namespace, FuncName, Params });
        }
        return apiList;
    }

    private changeBoolean(
        document: vscode.TextDocument,
        data: GameAPIChangeEvent<boolean>
    ) {
        const text = document.getText();
        const result = text.match(
            new RegExp(`^${data.Namespace}:${data.FuncName}\\(.+\\);?$`, 'm')
        );
        const changeText = `${data.Namespace}:${data.FuncName}(${data.value})`;

        if (!result) {
            writeDocument(document, text + '\n' + changeText);
            return;
        }
        writeDocument(document, text.replace(result[0], changeText));
    }

    private changeNumber(
        document: vscode.TextDocument,
        data: GameAPIChangeEvent<number>
    ) {
        const text = document.getText();
        const result = text.match(
            new RegExp(`^${data.Namespace}:${data.FuncName}\\(.+\\);?$`, 'm')
        );
        const changeText = `${data.Namespace}:${data.FuncName}(${data.value})`;

        if (!result) {
            writeDocument(document, text + '\n' + changeText);
            return;
        }
        writeDocument(document, text.replace(result[0], changeText));
    }

    private SetCustomGameTeamMaxPlayers(
        document: vscode.TextDocument,
        data: { team: string; value: number }
    ) {
        const text = document.getText();
        const result = text.match(
            new RegExp(
                `^GameRules:SetCustomGameTeamMaxPlayers\\(\\s*${data.team}\\s*,.+\\);?$`,
                'm'
            )
        );
        const changeText = `GameRules:SetCustomGameTeamMaxPlayers(${data.team}, ${data.value})`;

        if (!result) {
            writeDocument(document, text + '\n' + changeText);
            return;
        }
        writeDocument(document, text.replace(result[0], changeText));
    }

    private SetCustomAttributeDerivedStatValue(
        document: vscode.TextDocument,
        data: { enum: string; value: number }
    ) {
        const text = document.getText();
        const result = text.match(
            new RegExp(
                `^GameMode:SetCustomAttributeDerivedStatValue\\(\\s*${data.enum}\\s*,.+\\);?$`,
                'm'
            )
        );
        const changeText = `GameMode:SetCustomAttributeDerivedStatValue(${data.enum}, ${data.value})`;

        if (!result) {
            writeDocument(document, text + '\n' + changeText);
            return;
        }
        writeDocument(document, text.replace(result[0], changeText));
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
            this.apiList = this.parseCode(document.getText());
            webviewPanel.webview.postMessage({
                label: 'update',
                text: JSON.stringify(this.apiList),
            });
        };

        this.request.listenRequest('change-boolean', (...args: any[]) => {
            const data = args[0];
            if (typeof data !== 'object') {
                return;
            }
            this.changeBoolean(document, data);
        });

        this.request.listenRequest('change-number', (...args: any[]) => {
            const data = args[0];
            if (typeof data !== 'object') {
                return;
            }
            this.changeNumber(document, data);
        });

        this.request.listenRequest('SetCustomGameTeamMaxPlayers', (...args: any[]) => {
            const data = args[0];
            if (typeof data !== 'object') {
                return;
            }
            this.SetCustomGameTeamMaxPlayers(document, data);
        });

        this.request.listenRequest(
            'SetCustomAttributeDerivedStatValue',
            (...args: any[]) => {
                const data = args[0];
                if (typeof data !== 'object') {
                    return;
                }
                this.SetCustomAttributeDerivedStatValue(document, data);
            }
        );

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
            writeDocument(document, `local GameMode = GameRules:GetGameModeEntity()\n`);
            return;
        }

        updateData();
    }

    /**
     * Return HTML content
     * @param webview
     */
    private async getHTML(webview: vscode.Webview): Promise<string> {
        const nonce = GetNonce();

        const styleUri = webview.asWebviewUri(
            vscode.Uri.file(
                path.join(this.context.extensionPath, 'media/bundle/style.css')
            )
        );

        const indexJs = webview.asWebviewUri(
            vscode.Uri.file(
                path.join(
                    this.context.extensionPath,
                    'media/bundle/CustomGameSettings.js'
                )
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
