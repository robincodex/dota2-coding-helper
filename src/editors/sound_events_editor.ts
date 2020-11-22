import * as path from 'path';
import * as vscode from 'vscode';
import {
    KeyValues3,
    loadFromString,
    formatKeyValues,
    NewKeyValue,
    NewKeyValuesObject,
    NewKeyValuesArray,
} from 'easy-keyvalues/dist/kv3';
import {
    GetNonce,
    initializeKV3ToDocument,
    writeDocument,
    RequestHelper,
    locale,
} from './utils';
import { promises } from 'fs';

export class SoundEventsEditorService {
    private kvList: KeyValues3[];
    private request: RequestHelper;

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

    constructor(private readonly context: vscode.ExtensionContext) {
        this.request = new RequestHelper();
        this.kvList = [];
    }

    private getJSON(): string {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return '[]';
        }

        type resultType = { [key: string]: string | string[] };

        const result: resultType[] = [];
        for (const kv of root.Value) {
            if (!kv.Key.startsWith('"') && !kv.Key.endsWith('"')) {
                kv.Key = `"${kv.Key.trim()}"`;
            }

            const data: resultType = { event: kv.Key, vsnd_files: [] };
            result.push(data);

            if (Array.isArray(kv.Value)) {
                // Find vsnd_files
                const vsndFiles = kv.Value.find((v) => v.Key === 'vsnd_files');
                if (vsndFiles && Array.isArray(vsndFiles.Value)) {
                    for (const sound of vsndFiles.Value) {
                        if (
                            !Array.isArray(sound.Value) &&
                            Array.isArray(data.vsnd_files)
                        ) {
                            data.vsnd_files.push(sound.Value);
                        }
                    }
                }

                // Find some value from keys
                for (const child of kv.Value) {
                    if (!Array.isArray(child.Value) && child.Key !== 'vsnd_files') {
                        data[child.Key] = child.Value;
                    }
                }
            }
        }

        return JSON.stringify(result);
    }

    /**
     * Add a new event
     */
    private newSoundEvent(event: string): void {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        root.Value.push(
            NewKeyValuesObject(`"${event.trim()}"`, [
                NewKeyValue('type', 'dota_update_default'),
                NewKeyValuesArray('vsnd_files', []),
                NewKeyValue('volume', '1.0000'),
                NewKeyValue('pitch', '1.0000'),
            ])
        );
    }

    /**
     * Remove a event
     */
    private removeSoundEvent(event: string) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        event = `"${event}"`;
        root.Value = root.Value.filter((v) => v.Key !== event);
    }

    /**
     * Change a event name
     */
    private changeSoundEventName(oldEvent: string, newEvent: string) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        oldEvent = `"${oldEvent}"`;
        newEvent = `"${newEvent.trim()}"`;
        const kv = root.Value.find((v) => v.Key === oldEvent);
        if (kv) {
            kv.Key = newEvent;
        }
    }

    /**
     * Remove a sound file
     */
    private removeSoundFile(event: string, index: number) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        event = `"${event}"`;
        const kv = root.Value.find((v) => v.Key === event);
        if (kv && Array.isArray(kv.Value)) {
            const vsnd_files = kv.Value.find((v) => v.Key === 'vsnd_files');
            if (vsnd_files && Array.isArray(vsnd_files.Value)) {
                vsnd_files.Value.splice(index, 1);
            }
        }
    }

    /**
     * Add a sound file
     */
    private addSoundFile(event: string, file: string) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        event = `"${event}"`;
        const kv = root.Value.find((v) => v.Key === event);
        if (kv && Array.isArray(kv.Value)) {
            const vsnd_files = kv.Value.find((v) => v.Key === 'vsnd_files');
            if (vsnd_files && Array.isArray(vsnd_files.Value)) {
                vsnd_files.Value.push(NewKeyValue('', file));
            }
        }
    }

    /**
     * Add or change a sound key
     */
    private changeSoundKeyValue(event: string, key: string, value: string) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        event = `"${event}"`;
        const kv = root.Value.find((v) => v.Key === event);
        if (kv && Array.isArray(kv.Value)) {
            const child = kv.Value.find((v) => v.Key === key);
            if (child && !Array.isArray(child.Value)) {
                child.Value = value;
            } else {
                kv.Value.push(NewKeyValue(key, value));
            }
        }
    }

    /**
     * Remove a sound key
     */
    private removeSoundKey(event: string, key: string) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        event = `"${event}"`;
        const kv = root.Value.find((v) => v.Key === event);
        if (kv && Array.isArray(kv.Value)) {
            kv.Value = kv.Value.filter((v) => v.Key !== key);
        }
    }

    /**
     * Move a sound event
     */
    private moveSoundEvent(event: string, up: boolean) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        event = `"${event}"`;
        const index = root.Value.findIndex((v) => v.Key === event);
        if (up) {
            if (index === 0) {
                return;
            }
            [root.Value[index], root.Value[index - 1]] = [
                root.Value[index - 1],
                root.Value[index],
            ];
        } else {
            if (index === root.Value.length - 1) {
                return;
            }
            [root.Value[index], root.Value[index + 1]] = [
                root.Value[index + 1],
                root.Value[index],
            ];
        }
    }

    /**
     * Duplicate a sound event
     */
    private duplicateSoundEvent(event: string) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        event = `"${event}"`;
        const kv = root.Value.find((v) => v.Key === event);
        if (!kv || !Array.isArray(kv.Value)) {
            return;
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
        for (const child of root.Value) {
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

        const cloneKV: KeyValues3 = JSON.parse(JSON.stringify(kv));
        cloneKV.Key = `"${prefix + suffix}"`;

        const kvIndex = root.Value.findIndex((v) => v.Key === event);
        root.Value.splice(kvIndex + 1, 0, cloneKV);
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
        const updateKeyValues = async () => {
            try {
                this.kvList = await loadFromString(document.getText());
            } catch (e) {
                vscode.window.showErrorMessage(document.fileName + ': ' + e.toString());
            }
            webviewPanel.webview.postMessage({
                label: 'update',
                text: this.getJSON(),
            });
        };

        // Add a new event
        this.request.listenRequest('add-event', (...args: any[]) => {
            const event = args[0];
            if (typeof event !== 'string') {
                return;
            }
            if (event.length <= 0) {
                return;
            }
            this.newSoundEvent(event);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Remove a event
        this.request.listenRequest('remove-event', (...args: any[]) => {
            const event = args[0];
            if (typeof event !== 'string') {
                return;
            }
            if (event.length <= 0) {
                return;
            }
            this.removeSoundEvent(event);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Change a event name
        this.request.listenRequest('change-event-name', (...args: any[]) => {
            const oldEvent = args[0];
            const newEvent = args[1];
            if (typeof oldEvent !== 'string' && typeof newEvent !== 'string') {
                return;
            }
            if (newEvent.length <= 0) {
                return;
            }
            this.changeSoundEventName(oldEvent, newEvent);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Remove a sound file
        this.request.listenRequest('remove-sound-file', (...args: any[]) => {
            const event = args[0];
            const index = args[1];
            if (typeof event !== 'string' && typeof index !== 'number') {
                return;
            }
            if (event.length <= 0) {
                return;
            }
            this.removeSoundFile(event, index);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Add a sound file
        this.request.listenRequest('add-sound-file', (...args: any[]) => {
            const event = args[0];
            const file = args[1];
            if (typeof event !== 'string' && typeof file !== 'string') {
                return;
            }
            this.addSoundFile(event, file);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Return soundKeys
        this.request.listenRequest('get-sound-keys', (...args: any[]) => {
            return SoundEventsEditorService.soundKeys;
        });

        // Add or change a sound key
        this.request.listenRequest('change-sound-key', (...args: any[]) => {
            const event = args[0];
            const key = args[1];
            const value = args[2];
            if (
                typeof event !== 'string' &&
                typeof key !== 'string' &&
                typeof value !== 'string'
            ) {
                return;
            }
            this.changeSoundKeyValue(event, key, value);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Remove a sound key
        this.request.listenRequest('remove-sound-key', (...args: any[]) => {
            const event = args[0];
            const key = args[1];
            if (typeof event !== 'string' && typeof key !== 'string') {
                return;
            }
            this.removeSoundKey(event, key);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Move a sound event
        this.request.listenRequest('move-sound-event', (...args: any[]) => {
            const event = args[0];
            const up = args[1];
            if (typeof event !== 'string' && typeof up !== 'boolean') {
                return;
            }
            this.moveSoundEvent(event, up);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Dulpicate a sound event
        this.request.listenRequest('duplicate-sound-event', (...args: any[]) => {
            const event = args[0];
            if (typeof event !== 'string') {
                return;
            }
            this.duplicateSoundEvent(event);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        const onChangeDocument = vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.contentChanges.length <= 0) {
                return;
            }
            if (e.document.uri.toString() === document.uri.toString()) {
                updateKeyValues();
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
            initializeKV3ToDocument(document);
            return;
        }

        // Only support KeyValues3
        if (!document.lineAt(0).text.startsWith('<!--')) {
            vscode.window.showErrorMessage(
                "This file isn't kv3 format.\n" + document.uri.fsPath
            );
            return;
        }

        updateKeyValues();
    }

    /**
     * Return HTML content
     * @param webview
     */
    private async getHTML(webview: vscode.Webview): Promise<string> {
        const nonce = GetNonce();

        // const styleUri = webview.asWebviewUri(
        //     vscode.Uri.file(
        //         path.join(this.context.extensionPath, 'media/bundle/style.css')
        //     )
        // );

        const indexJs = webview.asWebviewUri(
            vscode.Uri.file(
                path.join(
                    this.context.extensionPath,
                    'media/bundle/SoundEventsEditor.js'
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
                <title>Sound Events Editor</title>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
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

export class SoundEventsEditorProvider implements vscode.CustomTextEditorProvider {
    private static readonly viewType = 'dota2CodingHelper.editSoundEvents';

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new SoundEventsEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(
            SoundEventsEditorProvider.viewType,
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
        const service = new SoundEventsEditorService(this.context);
        await service.resolveCustomTextEditor(document, webviewPanel, _token);
    }
}
