import path from 'path';
import * as vscode from 'vscode';
import { KeyValues3 } from 'easy-keyvalues';
import {
    GetNonce,
    initializeKV3ToDocument,
    writeDocument,
    RequestHelper,
    locale,
    cloneObject,
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

export type { ISoundEventData };

export class SoundEventsDocument extends KeyValues3Document {
    public request = new RequestHelper();
    private _copiedSoundEvents: KeyValues3[] = [];
    private _copySoundFiles: string[] = [];

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
        this.request.bind(this.newSoundEvent.bind(this));
        this.request.bind(this.removeSoundEvents.bind(this));
        this.request.bind(this.changeSoundEventName.bind(this));
        this.request.bind(this.copySoundEvents.bind(this));
        this.request.bind(this.pasteSoundEvents.bind(this));
        this.request.bind(this.removeSoundFiles.bind(this));
        this.request.bind(this.copySoundFiles.bind(this));
        this.request.bind(this.pasteSoundFiles.bind(this));
        this.request.bind(this.addSoundFiles.bind(this));
        this.request.bind(this.changeSoundFile.bind(this));
        this.request.bind(this.changeSoundKeyValue.bind(this));
        this.request.bind(this.moveSoundEvents.bind(this));
        this.request.bind(this.moveSoundFiles.bind(this));
        this.request.bind(this.duplicateSoundEvents.bind(this));
        this.request.bind(this.canPasteSoundEvents.bind(this));
    }

    /**
     * Convert to json string of ISoundEventData[]
     */
    toString() {
        const list: ISoundEventData[] = [];
        this._kvRoot.FindAll((kv) => {
            let kvType = kv.FindKey('type')?.GetValue();
            let kvVolume = kv.FindKey('volume')?.GetValue();
            let kvPitch = kv.FindKey('pitch')?.GetValue();
            let kvVsndFiles = kv.FindKey('vsnd_files')?.GetValue();
            let typeName = '';
            let volume = '1.000';
            let pitch = '1.000';
            if (kvType && kvType.IsString()) {
                typeName = kvType.Value();
            }
            if (kvVolume && kvVolume.IsString()) {
                volume = kvVolume.Value();
            }
            if (kvPitch && kvPitch.IsString()) {
                pitch = kvPitch.Value();
            }
            let vsndFiles: string[] = [];
            if (kvVsndFiles && kvVsndFiles.IsArray()) {
                for (const sound of kvVsndFiles.Value()) {
                    if (sound.IsString()) {
                        vsndFiles.push(sound.Value());
                    }
                }
            }
            list.push({
                event: kv.Key,
                type: typeName,
                vsnd_files: vsndFiles,
                volume,
                pitch,
                params: [],
            });
            return true;
        });
        return JSON.stringify(list);
    }

    /**
     * Add a new event
     */
    private newSoundEvent(soundIndex: number, newEvent: string): void {
        const soundKV = new KeyValues3(
            newEvent,
            KeyValues3.Object([
                new KeyValues3('type', KeyValues3.String('dota_update_default')),
                new KeyValues3('vsnd_files', KeyValues3.Array()),
                new KeyValues3('volume', KeyValues3.String('1.0000')),
                new KeyValues3('pitch', KeyValues3.String('1.0000')),
            ])
        );
        this.changeContent({
            label: 'newSoundEvent',
            undo: () => {
                this._kvRoot.GetObject().Delete(soundKV);
            },
            redo: () => {
                this._kvRoot.GetObject().Insert(soundIndex, soundKV);
            },
        });
    }

    /**
     * Remove a event
     */
    private removeSoundEvents(soundIndexes: number[]) {
        const value = this._kvRoot.GetValue();
        if (value.IsObject()) {
            soundIndexes = soundIndexes.sort();
            console.log(soundIndexes);
            const kvList = soundIndexes.map((v) => value.Get(v));
            this.changeContent({
                label: 'removeSoundEvents',
                undo: () => {
                    for (let i = 0; i < soundIndexes.length; i++) {
                        const kv = kvList[i];
                        if (kv) {
                            value.Insert(soundIndexes[i], kv);
                        }
                    }
                },
                redo: () => {
                    for (const kv of kvList) {
                        if (kv) {
                            value.Delete(kv);
                        }
                    }
                },
            });
        }
    }

    /**
     * Change a event name
     */
    private changeSoundEventName(soundIndex: number, newEventName: string) {
        const v = this._kvRoot.GetValue();
        if (!v.IsObject()) {
            return;
        }
        const kv = v.Find((_, i) => i === soundIndex);
        if (!kv) {
            return;
        }
        const oldEventName = kv.Key;
        newEventName = newEventName.trim();
        this.changeContent({
            label: 'changeSoundEventName',
            undo: () => {
                kv.Key = oldEventName;
            },
            redo: () => {
                kv.Key = newEventName;
            },
        });
    }

    /**
     * Copy sound events
     */
    private copySoundEvents(soundIndexes: number[]) {
        const v = this._kvRoot.GetValue();
        if (!v.IsObject()) {
            return;
        }
        this._copiedSoundEvents = v
            .FindAll((_, i) => soundIndexes.includes(i))
            .map((v) => v.Clone());
        vscode.env.clipboard.writeText(this._copiedSoundEvents.map((v) => v.toString()).join('\n'));
    }

    /**
     * Paste sound events, return copy count
     */
    private pasteSoundEvents(lastIndex: number): number[] {
        const v = this._kvRoot.GetValue();
        if (!v.IsObject()) {
            return [lastIndex];
        }
        if (this._copiedSoundEvents.length <= 0) {
            return [lastIndex];
        }
        const list = this._copiedSoundEvents.map((v) => v.Clone());
        this.changeContent({
            label: '',
            undo: () => {
                list.forEach((kv) => v.Delete(kv));
            },
            redo: () => {
                v.Insert(lastIndex + 1, ...list);
            },
        });
        return list.map((_, i) => lastIndex + i + 1);
    }

    /**
     *
     */
    private canPasteSoundEvents() {
        return this._copiedSoundEvents.length > 0;
    }

    /**
     * Remove sound files
     */
    private removeSoundFiles(soundIndex: number, fileIndexes: number[]) {
        const kv = this._kvRoot.GetObject().Get(soundIndex);
        if (kv) {
            const vsndFiles = kv.FindKey('vsnd_files')?.GetArray();
            if (vsndFiles) {
                fileIndexes = fileIndexes.sort();
                const items = fileIndexes.map((v) => vsndFiles.Get(v));
                this.changeContent({
                    label: 'removeSoundFiles',
                    undo: () => {
                        for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            if (item) {
                                vsndFiles.Insert(fileIndexes[i], item);
                            }
                        }
                    },
                    redo: () => {
                        for (const item of items) {
                            if (item) {
                                vsndFiles.Delete(item);
                            }
                        }
                    },
                });
            }
        }
    }

    /**
     * Copy sound files
     */
    private copySoundFiles(soundIndex: number, fileIndexes: number[]) {
        const kv = this._kvRoot.GetObject().Get(soundIndex);
        if (kv) {
            const vsndFiles = kv.FindKey('vsnd_files')?.GetArray();
            if (vsndFiles) {
                this._copySoundFiles = vsndFiles
                    .Value()
                    .filter((v, i) => fileIndexes.includes(i) && v.IsString())
                    .map((v) => v.Value());
                vscode.env.clipboard.writeText(this._copySoundFiles.join('\n'));
            }
        }
    }

    /**
     * Paste sound files
     */
    private pasteSoundFiles(soundIndex: number, fileIndexes: number[]) {
        const kv = this._kvRoot.GetObject().Get(soundIndex);
        if (kv) {
            const vsndFiles = kv.FindKey('vsnd_files')?.GetArray();
            if (vsndFiles) {
                const files = this._copySoundFiles.map((v) => KeyValues3.String(v));
                const target = fileIndexes.sort().pop() || vsndFiles.Value().length;
                this.changeContent({
                    label: '',
                    undo: () => {
                        files.forEach((v) => vsndFiles.Delete(v));
                    },
                    redo: () => {
                        vsndFiles.Insert(target + 1, ...files);
                    },
                });
            }
        }
    }

    /**
     * Add a sound file
     */
    private addSoundFiles(soundIndex: number, itemIndex: number, files: string[]) {
        const kv = this._kvRoot.GetObject().Get(soundIndex);
        if (kv) {
            const vsndFiles = kv.FindKey('vsnd_files')?.GetArray();
            if (vsndFiles) {
                const list = files.map((v) => KeyValues3.String(v));
                this.changeContent({
                    label: 'addSoundFiles',
                    undo: () => {
                        list.forEach((v) => vsndFiles.Delete(v));
                    },
                    redo: () => {
                        vsndFiles.Insert(itemIndex, ...list);
                    },
                });
            }
        }
    }

    /**
     * Change a sound file
     */
    private changeSoundFile(soundIndex: number, itemIndex: number, file: string) {
        const kv = this._kvRoot.GetObject().Get(soundIndex);
        if (kv) {
            const vsndFiles = kv.FindKey('vsnd_files')?.GetArray();
            if (vsndFiles) {
                const item = vsndFiles.Get(itemIndex);
                if (item && item.IsString()) {
                    const oldFile = item.Value();
                    this.changeContent({
                        label: 'changeSoundFile',
                        undo: () => {
                            item.SetValue(oldFile);
                        },
                        redo: () => {
                            item.SetValue(file);
                        },
                    });
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
            this.editChangeValue(kv, key, KeyValues3.String(value));
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
        soundIndexes = soundIndexes.sort();
        for (const soundIndex of soundIndexes) {
            const child = obj.Get(soundIndex);
            if (child && soundIndex !== targetIndex) {
                list.push(child);
            }
        }

        this.changeContent({
            label: 'moveSoundEvents',
            undo: () => {
                list.forEach((v) => {
                    obj.Delete(v);
                });
                list.forEach((v, i) => {
                    obj.Insert(soundIndexes[i], v);
                });
            },
            redo: () => {
                list.forEach((v) => obj.Delete(v));
                targetIndex = obj.Value().indexOf(target);
                if (!isTop) {
                    targetIndex += 1;
                }
                obj.Insert(targetIndex, ...list);
            },
        });

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
        const vsndFiles = eventKV.FindKey('vsnd_files')?.GetArray();
        if (!vsndFiles) {
            return;
        }
        const target = vsndFiles.Get(targetIndex);
        if (!target) {
            return;
        }
        const list: IKV3Value[] = [];
        fileIndexes = fileIndexes.sort();
        for (const soundIndex of fileIndexes.sort()) {
            const v = vsndFiles.Get(soundIndex);
            if (v && soundIndex !== targetIndex) {
                list.push(v);
            }
        }

        this.changeContent({
            label: 'moveSoundFiles',
            undo: () => {
                list.forEach((v) => vsndFiles.Delete(v));
                list.forEach((v, i) => {
                    vsndFiles.Insert(fileIndexes[i], v);
                });
            },
            redo: () => {
                list.forEach((v) => vsndFiles.Delete(v));
                targetIndex = vsndFiles.Value().indexOf(target);
                if (!isTop) {
                    targetIndex += 1;
                }
                vsndFiles.Insert(targetIndex, ...list);
            },
        });

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
        let result: [number, KeyValues3][] = [];
        for (const soundIndex of soundIndexes.sort()) {
            const kv = obj.Get(soundIndex);
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
            cloneKV.Key = `${prefix + suffix}`;
            result.push([soundIndex + i + 1, cloneKV]);
            i++;
        }

        this.changeContent({
            label: 'duplicateSoundEvents',
            undo: () => {
                result.forEach((v) => obj.Delete(v[1]));
            },
            redo: () => {
                result.forEach((v) => obj.Insert(v[0], v[1]));
            },
        });

        return result.map((v) => v[0]);
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
                for (const webviewPanel of this.webviews.get(document.uri)) {
                    webviewPanel.webview.postMessage({
                        label: 'update',
                        text: document.toString(),
                    });
                }

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
                for (const webviewPanel of this.webviews.get(document.uri)) {
                    webviewPanel.webview.postMessage({
                        label: 'update',
                        text: document.toString(),
                    });
                }
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

        webviewPanel.webview.onDidReceiveMessage((e) => {
            if (e.label === 'layout-ready') {
                for (const webviewPanel of this.webviews.get(document.uri)) {
                    webviewPanel.webview.postMessage({
                        label: 'update',
                        text: document.toString(),
                    });
                }
                return;
            }
            document.request.onRequest(e, webviewPanel.webview);
        });
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
