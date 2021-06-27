import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class CustomGameDocuments {
    private webviewPanel: vscode.WebviewPanel;
    private viewType: string;

    constructor(private readonly context: vscode.ExtensionContext) {
        // @ts-ignore
        this.webviewPanel = null;
        this.viewType = `dota2CodingHelper.documents`;
    }

    public register() {
        return vscode.commands.registerCommand(this.viewType, this.start.bind(this));
    }

    private start(): void {
        this.webviewPanel = vscode.window.createWebviewPanel(
            this.viewType,
            `Custom Game Documents`,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                enableFindWidget: true,
            }
        );
        this.renderHTML();
    }

    private async getDirsInfo() {
        type file_info_t = {
            filename: string;
            realname: string;
        };
        const sortList: string[] = [
            'CSS.html',
            'Panel.html',
            'Label.html',
            'Image.html',
            'Button.html',
            '综合.html',
        ];
        const sortFunc = (a: file_info_t, b: file_info_t) => {
            if (a.realname === b.realname) {
                return 0;
            }
            let c = sortList.indexOf(a.realname);
            let d = sortList.indexOf(b.realname);
            if (c >= 0 && d >= 0) {
                return sortList.indexOf(a.realname) < sortList.indexOf(b.realname) ? -1 : 1;
            } else if (c >= 0) {
                return -1;
            } else if (d >= 0) {
                return 1;
            }
            return a > b ? 1 : -1;
        };

        const rootPath = path.resolve(__dirname, '../media/docs');
        const info: { [key: string]: file_info_t[] } = {};
        const docs = await fs.promises.readdir(rootPath);
        for (const category of docs) {
            const list: file_info_t[] = [];
            const files = await fs.promises.readdir(path.join(rootPath, category));
            const files2 = files.map((v) => {
                return {
                    filename: v,
                    realname: Buffer.from(v.replace('.html', ''), 'hex').toString('utf8') + '.html',
                };
            });
            files2.sort(sortFunc);
            list.push(...files2);
            info[category] = list;
        }
        return JSON.stringify(info);
    }

    private async renderHTML() {
        const media = path.join(this.context.extensionPath, 'media');

        const styleUri = this.webviewPanel.webview.asWebviewUri(
            vscode.Uri.file(path.join(media, 'documents.css'))
        );

        const jsUri = this.webviewPanel.webview.asWebviewUri(
            vscode.Uri.file(path.join(media, 'documents.js'))
        );

        const docsUri = this.webviewPanel.webview.asWebviewUri(
            vscode.Uri.file(path.join(media, 'docs'))
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
                    window.docsUri = "${docsUri}";
                    window.dirsInfo = ${await this.getDirsInfo()};
                </script>
                <script src="${jsUri}"></script>
            </body>
            </html>`;
    }
}
