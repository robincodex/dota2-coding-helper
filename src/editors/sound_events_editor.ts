import * as path from 'path';
import * as vscode from 'vscode';
import { KeyValues3 } from 'easy-keyvalues';
import {
    GetNonce,
    initializeKV3ToDocument,
    writeDocument,
    RequestHelper,
    locale,
    cloneObject,
    PostMethod,
} from './utils';
import { KeyValues3Document } from './kv3_document';
import WebviewCollection from './webview_collection';
import { disposeAll } from './dispose';
import { IKV3Value } from 'easy-keyvalues/KeyValues3';

interface ISoundEventData {
    event: string;
    type: string;
    vsnd_files: string[];
    volume: string;
    pitch: string;
    params: Array<{ key: string; value: string }>;
}

let copySoundEvents: KeyValues3[] = [];
let copySoundFiles: string[] = [];

export type { ISoundEventData };

export class SoundEventsDocument extends KeyValues3Document {
    public request = new RequestHelper();

    private static soundKeys: string[] = [
        'type',
        'volume',
        'pitch',
        'pitch_rand_min',
        'pitch_rand_max',
        'event_type',
        'memory_type',
        'soundlevel',
        'mixgroup',
        'spread_radius',
        'distance_max',
    ];

    constructor(uri: vscode.Uri, initialKV: KeyValues3) {
        super(uri, initialKV);
    }

    /**
     * Add a new event
     */
    @PostMethod()
    private newSoundEvent(soundIndex: number, newEvent: string): void {
        this._kvRoot.CreateObjectValue(
            newEvent,
            new KeyValues3.Object([
                new KeyValues3('type', new KeyValues3.String('dota_update_default')),
                new KeyValues3('vsnd_files', new KeyValues3.Array()),
                new KeyValues3('volume', new KeyValues3.String('1.0000')),
                new KeyValues3('pitch', new KeyValues3.String('1.0000')),
            ])
        );
    }

    /**
     * Remove a event
     */
    private removeSoundEvent(soundIndexes: number[]) {
        const v = this._kvRoot.GetValue();
        if (v.IsObject()) {
            const kvList = v.FindAll((_, i) => soundIndexes.includes(i));
            for (const kv of kvList) {
                v.Delete(kv);
            }
        }
    }

    /**
     * Change a event name
     */
    private changeSoundEventName(soundIndex: number, newEvent: string) {
        const v = this._kvRoot.GetValue();
        if (!v.IsObject()) {
            return;
        }
        const kv = v.Find((_, i) => i === soundIndex);
        if (!kv) {
            return;
        }
        kv.Key = newEvent.trim();
    }

    /**
     * Copy sound events
     */
    private copySoundEvents(soundIndexes: number[]) {
        const v = this._kvRoot.GetValue();
        if (!v.IsObject()) {
            return;
        }
        copySoundEvents = v.FindAll((_, i) => soundIndexes.includes(i)).map((v) => v.Clone());
        let result = '';
        for (const kv of copySoundEvents) {
            result += kv.toString();
        }
        vscode.env.clipboard.writeText(result);
    }

    /**
     * Paste sound events, return copy count
     */
    private pasteSoundEvents(lastIndex: number): number {
        const v = this._kvRoot.GetValue();
        if (!v.IsObject()) {
            return 0;
        }
        if (copySoundEvents.length <= 0) {
            return 0;
        }
        v.Append(...copySoundEvents.map((v) => v.Clone()));
        return copySoundEvents.length;
    }

    /**
     * Remove sound files
     */
    private removeSoundFiles(soundIndex: number, fileIndexes: number[]) {
        const kv = this._kvRoot.GetObject().Get(soundIndex);
        if (kv) {
            const vsnd_files = kv.FindKey('vsnd_files');
            if (vsnd_files) {
                const items = vsnd_files.GetArray();
                for (const i of fileIndexes) {
                    const item = items.Get(i);
                    if (item) {
                        items.Delete(item);
                    }
                }
            }
        }
    }

    /**
     * Copy sound files
     */
    private copySoundFiles(soundIndex: number, fileIndexes: number[]) {
        // const root = this.kvRoot[1];
        // if (!root || !Array.isArray(root.Value)) {
        //     return;
        // }
        // const kv = root.Value[soundIndex];
        // if (kv && Array.isArray(kv.Value)) {
        //     const vsnd_files = kv.Value.find((v) => v.Key === 'vsnd_files');
        //     if (vsnd_files && Array.isArray(vsnd_files.Value)) {
        //         const list = vsnd_files.Value.filter((v, i) => {
        //             return fileIndexes.includes(i);
        //         });
        //         copySoundFiles = list.map((v) => String(v.Value));
        //         vscode.env.clipboard.writeText(copySoundFiles.join('\n'));
        //     }
        // }
    }

    /**
     * Paste sound files
     */
    private pasteSoundFiles(soundIndex: number, fileIndexes: number[]) {
        // const root = this.kvRoot[1];
        // if (!root || !Array.isArray(root.Value)) {
        //     return;
        // }
        // const kv = root.Value[soundIndex];
        // if (kv && Array.isArray(kv.Value)) {
        //     const vsnd_files = kv.Value.find((v) => v.Key === 'vsnd_files');
        //     if (vsnd_files && Array.isArray(vsnd_files.Value)) {
        //         const i = fileIndexes.sort().pop() || vsnd_files.Value.length;
        //         if (typeof i === 'number') {
        //             vsnd_files.Value.splice(
        //                 i + 1,
        //                 0,
        //                 ...copySoundFiles.map((v) => NewKeyValue('', v))
        //             );
        //         }
        //     }
        // }
    }

    /**
     * Add a sound file
     */
    private addSoundFile(soundIndex: number, itemIndex: number, files: string[]) {
        const kv = this._kvRoot.GetObject().Get(soundIndex);
        if (kv) {
            const vsnd_files = kv.FindKey('vsnd_files');
            if (vsnd_files) {
                const items = vsnd_files.GetArray();
                items.Insert(itemIndex, ...files.map((v) => new KeyValues3.String(v)));
            }
        }
    }

    /**
     * Change a sound file
     */
    private changeSoundFile(soundIndex: number, itemIndex: number, file: string) {
        const kv = this._kvRoot.GetObject().Get(soundIndex);
        if (kv) {
            const vsnd_files = kv.FindKey('vsnd_files');
            if (vsnd_files) {
                const items = vsnd_files.GetArray();
                const item = items.Get(itemIndex);
                if (item && item.IsString()) {
                    item.SetValue(file);
                }
            }
        }
    }

    /**
     * Add or change a sound key
     */
    private changeSoundKeyValue(soundIndex: number, key: string, value: string) {
        const kv = this._kvRoot.GetObject().Get(soundIndex);
        if (kv) {
            kv.GetObject().Create(key, new KeyValues3.String(value));
        }
    }

    /**
     * Move sound events
     */
    private moveSoundEvents(soundIndexes: number[], targetIndex: number, isTop: boolean) {
        const obj = this._kvRoot.GetObject();
        const target = obj.Get(targetIndex);
        if (!target) {
            return;
        }
        const list: KeyValues3[] = [];
        for (const soundIndex of soundIndexes.sort().reverse()) {
            const child = obj.Get(soundIndex);
            if (child && soundIndex !== targetIndex) {
                obj.Delete(child);
                list.push(child);
            }
        }
        targetIndex = obj.Value().indexOf(target);
        if (!isTop) {
            targetIndex += 1;
        }
        obj.Insert(targetIndex, ...list.reverse());
        return {
            startIndex: targetIndex,
            length: list.length,
        };
    }

    /**
     * Move sound files
     */
    private moveSoundFiles(
        soundIndex: number,
        fileIndexes: number[],
        targetIndex: number,
        isTop: boolean
    ) {
        const eventKV = this._kvRoot.GetObject().Get(soundIndex);
        if (!eventKV) {
            return;
        }
        const vsndFilesKV = eventKV.FindKey('vsnd_files');
        if (!vsndFilesKV) {
            return;
        }
        const vsndFiles = vsndFilesKV.GetArray();
        const target = vsndFiles.Get(targetIndex);
        if (!target) {
            return;
        }
        const list: IKV3Value[] = [];
        for (const soundIndex of fileIndexes.sort().reverse()) {
            const v = vsndFiles.Get(soundIndex);
            if (v && soundIndex !== targetIndex) {
                vsndFiles.Delete(v);
                list.push(v);
            }
        }
        targetIndex = vsndFiles.Value().indexOf(target);
        if (!isTop) {
            targetIndex += 1;
        }
        vsndFiles.Insert(targetIndex, ...list.reverse());
        return {
            startIndex: targetIndex,
            length: list.length,
        };
    }

    /**
     * Duplicate sound events
     */
    private duplicateSoundEvents(soundIndexes: number[]) {
        const obj = this._kvRoot.GetObject();
        let i = 0;
        let result: number[] = [];
        for (const soundIndex of soundIndexes.sort()) {
            const kv = obj.Get(soundIndex + i);
            if (!kv) {
                continue;
            }
            // Find number from end of string
            const key = kv.Key.replace(/\"/g, '');
            const lastNumberMatch = key.match(/\d+$/);
            let zeroCount = 0;
            let currentNumber = -1;
            let prefix = key;
            if (lastNumberMatch) {
                const num = lastNumberMatch[0];
                currentNumber = parseInt(num);
                prefix = prefix.replace(new RegExp(`${num}$`), '');
                for (const n of num) {
                    if (n === '0') {
                        zeroCount++;
                        continue;
                    }
                    break;
                }
            } else {
                currentNumber = 0;
            }
            // Find max number
            const prefix2 = `"${prefix}`;
            for (const child of obj.Value()) {
                if (child.Key.startsWith(prefix2)) {
                    const num = parseInt(child.Key.replace(prefix2, '').replace(/\"/g, ''));
                    if (!isNaN(num) && num > currentNumber) {
                        currentNumber = num;
                    }
                }
            }
            let suffix = (currentNumber + 1).toString();
            if (suffix.length <= zeroCount) {
                suffix = '0'.repeat(zeroCount - suffix.length + 1) + suffix;
            }
            const cloneKV = kv.Clone();
            cloneKV.Key = `"${prefix + suffix}"`;
            obj.Insert(soundIndex + i + 1, cloneKV);
            result.push(soundIndex + i + 1);
            i++;
        }
        return result;
    }

    public dispose() {
        super.dispose();
        this.request.clear();
    }
}

export class SoundEventsEditorProvider implements vscode.CustomEditorProvider<KeyValues3Document> {
    private static readonly viewType = 'dota2CodingHelper.editSoundEvents';

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        return vscode.window.registerCustomEditorProvider(
            SoundEventsEditorProvider.viewType,
            new SoundEventsEditorProvider(context),
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
                supportsMultipleEditorsPerDocument: false,
            }
        );
    }

    /**
     * Tracks all known webviews
     */
    private readonly webviews = new WebviewCollection();

    constructor(private readonly context: vscode.ExtensionContext) {}

    async openCustomDocument(
        uri: vscode.Uri,
        openContext: { backupId?: string },
        _token: vscode.CancellationToken
    ): Promise<SoundEventsDocument> {
        const document = await SoundEventsDocument.create(
            SoundEventsDocument,
            uri,
            openContext.backupId
        );

        const listeners: vscode.Disposable[] = [];

        listeners.push(
            document.onDidChange((e) => {
                // Tell VS Code that the document has been edited by the use.
                this._onDidChangeCustomDocument.fire({
                    document,
                    ...e,
                });
            })
        );

        listeners.push(
            document.onDidChangeContent((e) => {
                // Update all webviews when the document changes
                // for (const webviewPanel of this.webviews.get(document.uri)) {
                //     this.postMessage(webviewPanel, 'update', {
                //         edits: e.edits,
                //         content: e.content,
                //     });
                // }
            })
        );

        document.onDidDispose(() => disposeAll(listeners));

        return document;
    }

    async resolveCustomEditor(
        document: SoundEventsDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        // Add the webview to our internal set of active webviews
        this.webviews.add(document.uri, webviewPanel);

        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = await this.getHTML(webviewPanel.webview);

        webviewPanel.webview.onDidReceiveMessage((e) =>
            document.request.onRequest(e, webviewPanel.webview)
        );
    }

    private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<
        vscode.CustomDocumentEditEvent<KeyValues3Document>
    >();
    public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

    public saveCustomDocument(
        document: KeyValues3Document,
        cancellation: vscode.CancellationToken
    ): Thenable<void> {
        return document.save(cancellation);
    }

    public saveCustomDocumentAs(
        document: KeyValues3Document,
        destination: vscode.Uri,
        cancellation: vscode.CancellationToken
    ): Thenable<void> {
        return document.saveAs(destination, cancellation);
    }

    public revertCustomDocument(
        document: KeyValues3Document,
        cancellation: vscode.CancellationToken
    ): Thenable<void> {
        return document.revert(cancellation);
    }

    public backupCustomDocument(
        document: KeyValues3Document,
        context: vscode.CustomDocumentBackupContext,
        cancellation: vscode.CancellationToken
    ): Thenable<vscode.CustomDocumentBackup> {
        return document.backup(context.destination, cancellation);
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
                path.join(this.context.extensionPath, 'media/bundle/SoundEventsEditor.js')
            )
        );

        // prettier-ignore
        return `
            <!DOCTYPE html>
            <html lang="${locale()}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sound Events Editor</title>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src 'nonce-${nonce}' ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <link href="${styleUri}" nonce="${nonce}" rel="stylesheet" />
                <script nonce="${nonce}">window._nonce_ = "${nonce}"</script>
                <script nonce="${nonce}" type="module" src="${indexJs}" defer></script>
            </head>
            <body>
                <div id="app" />
            </body>
            </html>
        `;
    }
}
