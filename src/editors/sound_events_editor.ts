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
import clone from 'lodash/clone';

interface ISoundEventData {
    event: string;
    type: string;
    vsnd_files: string[];
    volume: string;
    pitch: string;
    params: Record<string, string>;
}

let copySoundEvents: KeyValues3[] = [];
let copySoundFiles: string[] = [];

export type { ISoundEventData };

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

        const result: ISoundEventData[] = [];
        for (const kv of root.Value) {
            if (!kv.Key.startsWith('"') && !kv.Key.endsWith('"')) {
                kv.Key = `"${kv.Key.trim()}"`;
            }

            const data: ISoundEventData = {
                event: kv.Key,
                vsnd_files: [],
                pitch: '1.0000',
                volume: '1.0000',
                type: '',
                params: {},
            };
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
                        switch (child.Key) {
                            case 'event':
                            case 'pitch':
                            case 'volume':
                            case 'type':
                                data[child.Key] = child.Value;
                                break;
                            default:
                                data.params[child.Key] = child.Value;
                                break;
                        }
                    }
                }
            }
        }

        return JSON.stringify(result);
    }

    /**
     * Add a new event
     */
    private newSoundEvent(soundIndex: number, newEvent: string): void {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        root.Value.splice(
            soundIndex + 1,
            0,
            NewKeyValuesObject(`"${newEvent}"`, [
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
    private removeSoundEvent(soundIndexes: number[]) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        root.Value = root.Value.filter((v, i) => {
            return !soundIndexes.includes(i);
        });
    }

    /**
     * Change a event name
     */
    private changeSoundEventName(soundIndex: number, newEvent: string) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        newEvent = `"${newEvent.trim()}"`;
        const kv = root.Value[soundIndex];
        if (kv) {
            kv.Key = newEvent;
        }
    }

    /**
     * Copy sound events
     */
    private copySoundEvents(soundIndexes: number[]) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        copySoundEvents = [];
        for (const index of soundIndexes) {
            const kv = root.Value[index];
            if (kv) {
                copySoundEvents.push(clone(kv));
            }
        }
        vscode.env.clipboard.writeText(formatKeyValues(copySoundEvents));
    }

    /**
     * Paste sound events
     */
    private pasteSoundEvents(lastIndex: number): number[] {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return [];
        }
        if (copySoundEvents.length <= 0) {
            return [];
        }
        const list = Array.from(copySoundEvents.keys());
        if (lastIndex < root.Value.length && lastIndex >= 0) {
            root.Value.splice(lastIndex + 1, 0, ...copySoundEvents);
            return list.map((v) => v + lastIndex + 1);
        }
        const len = root.Value.length;
        root.Value.push(...copySoundEvents);
        return list.map((v) => v + len);
    }

    /**
     * Remove sound files
     */
    private removeSoundFiles(soundIndex: number, fileIndexes: number[]) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        const kv = root.Value[soundIndex];
        if (kv && Array.isArray(kv.Value)) {
            const vsnd_files = kv.Value.find((v) => v.Key === 'vsnd_files');
            if (vsnd_files && Array.isArray(vsnd_files.Value)) {
                vsnd_files.Value = vsnd_files.Value.filter((v, i) => {
                    return !fileIndexes.includes(i);
                });
            }
        }
    }

    /**
     * Copy sound files
     */
    private copySoundFiles(soundIndex: number, fileIndexes: number[]) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        const kv = root.Value[soundIndex];
        if (kv && Array.isArray(kv.Value)) {
            const vsnd_files = kv.Value.find((v) => v.Key === 'vsnd_files');
            if (vsnd_files && Array.isArray(vsnd_files.Value)) {
                const list = vsnd_files.Value.filter((v, i) => {
                    return fileIndexes.includes(i);
                });
                copySoundFiles = list.map((v) => String(v.Value));
                vscode.env.clipboard.writeText(copySoundFiles.join('\n'));
            }
        }
    }

    /**
     * Paste sound files
     */
    private pasteSoundFiles(soundIndex: number, fileIndexes: number[]) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        const kv = root.Value[soundIndex];
        if (kv && Array.isArray(kv.Value)) {
            const vsnd_files = kv.Value.find((v) => v.Key === 'vsnd_files');
            if (vsnd_files && Array.isArray(vsnd_files.Value)) {
                const i = fileIndexes.sort().pop() || vsnd_files.Value.length;
                if (typeof i === 'number') {
                    vsnd_files.Value.splice(
                        i + 1,
                        0,
                        ...copySoundFiles.map((v) => NewKeyValue('', v))
                    );
                }
            }
        }
    }

    /**
     * Add a sound file
     */
    private addSoundFile(soundIndex: number, itemIndex: number, files: string[]) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        const kv = root.Value[soundIndex];
        if (kv && Array.isArray(kv.Value)) {
            const vsnd_files = kv.Value.find((v) => v.Key === 'vsnd_files');
            if (vsnd_files && Array.isArray(vsnd_files.Value)) {
                vsnd_files.Value.splice(
                    itemIndex + 1,
                    0,
                    ...files.map((v) => NewKeyValue('', v))
                );
            }
        }
    }

    /**
     * Change a sound file
     */
    private changeSoundFile(soundIndex: number, itemIndex: number, file: string) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        const kv = root.Value[soundIndex];
        if (kv && Array.isArray(kv.Value)) {
            const vsnd_files = kv.Value.find((v) => v.Key === 'vsnd_files');
            if (vsnd_files && Array.isArray(vsnd_files.Value)) {
                vsnd_files.Value[itemIndex].Value = file;
            }
        }
    }

    /**
     * Add or change a sound key
     */
    private changeSoundKeyValue(soundIndex: number, key: string, value: string) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        const kv = root.Value[soundIndex];
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
     * Move sound events
     */
    private moveSoundEvents(
        soundIndexes: number[],
        targetIndex: number,
        isTop: boolean
    ) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        const kv = root.Value[targetIndex];
        if (!kv) {
            return;
        }
        const list: KeyValues3[] = [];
        for (const soundIndex of soundIndexes.sort().reverse()) {
            if (root.Value[soundIndex] && soundIndex !== targetIndex) {
                list.push(...root.Value.splice(soundIndex, 1));
            }
        }
        targetIndex = root.Value.indexOf(kv);
        if (!isTop) {
            targetIndex += 1;
        }
        root.Value.splice(targetIndex, 0, ...list.reverse());
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
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }
        const eventKV = root.Value[soundIndex];
        if (!eventKV || !Array.isArray(eventKV.Value)) {
            return;
        }
        const vsndFiles = eventKV.Value.find((v) => v.Key === 'vsnd_files');
        if (!vsndFiles || !Array.isArray(vsndFiles.Value)) {
            return;
        }
        const kv = vsndFiles.Value[targetIndex];
        if (!kv) {
            return;
        }
        const list: KeyValues3[] = [];
        for (const soundIndex of fileIndexes.sort().reverse()) {
            if (vsndFiles.Value[soundIndex] && soundIndex !== targetIndex) {
                list.push(...vsndFiles.Value.splice(soundIndex, 1));
            }
        }
        targetIndex = vsndFiles.Value.indexOf(kv);
        if (!isTop) {
            targetIndex += 1;
        }
        vsndFiles.Value.splice(targetIndex, 0, ...list.reverse());
        return {
            startIndex: targetIndex,
            length: list.length,
        };
    }

    /**
     * Duplicate sound events
     */
    private duplicateSoundEvents(soundIndexes: number[]) {
        const root = this.kvList[1];
        if (!root || !Array.isArray(root.Value)) {
            return;
        }

        let i = 0;
        for (const soundIndex of soundIndexes.sort()) {
            const kv = root.Value[soundIndex + i];
            if (!kv || !Array.isArray(kv.Value)) {
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
            for (const child of root.Value) {
                if (child.Key.startsWith(prefix2)) {
                    const num = parseInt(
                        child.Key.replace(prefix2, '').replace(/\"/g, '')
                    );
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

            root.Value.splice(soundIndex + i + 1, 0, cloneKV);
            i++;
        }
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
            const soundIndex = args[0];
            const newEvent = args[1];
            if (typeof soundIndex !== 'number' || typeof newEvent !== 'string') {
                return;
            }
            if (newEvent.length <= 0) {
                return;
            }
            this.newSoundEvent(soundIndex, newEvent);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Remove a event
        this.request.listenRequest('remove-events', (...args: any[]) => {
            const soundIndexes = args[0];
            if (!Array.isArray(soundIndexes)) {
                return;
            }
            this.removeSoundEvent(soundIndexes);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Change a event name
        this.request.listenRequest('change-event-name', (...args: any[]) => {
            const soundIndex = args[0];
            const newEvent = args[1];
            if (typeof soundIndex !== 'number' || typeof newEvent !== 'string') {
                return;
            }
            if (newEvent.length <= 0) {
                return;
            }
            this.changeSoundEventName(soundIndex, newEvent);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Copy sound events
        this.request.listenRequest('copy-sound-events', (...args: any[]) => {
            const soundIndexes = args[0];
            if (!Array.isArray(soundIndexes)) {
                return;
            }
            this.copySoundEvents(soundIndexes);
        });

        // Paste sound events
        this.request.listenRequest('paste-sound-events', (...args: any[]) => {
            const lastIndex = args[0];
            if (typeof lastIndex !== 'number') {
                return;
            }
            const list = this.pasteSoundEvents(lastIndex);
            if (list.length > 0) {
                writeDocument(document, formatKeyValues(this.kvList));
            }
            return list;
        });

        // Paste sound events
        this.request.listenRequest('can-paste-sound-events', (...args: any[]) => {
            return copySoundEvents.length > 0;
        });

        // Remove sound files
        this.request.listenRequest('remove-sound-files', (...args: any[]) => {
            const soundIndex = args[0];
            const fileIndexes = args[1];
            if (typeof soundIndex !== 'number' || !Array.isArray(fileIndexes)) {
                return;
            }
            this.removeSoundFiles(soundIndex, fileIndexes);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Copy sound files
        this.request.listenRequest('copy-sound-files', (...args: any[]) => {
            const soundIndex = args[0];
            const fileIndexes = args[1];
            if (typeof soundIndex !== 'number' || !Array.isArray(fileIndexes)) {
                return;
            }
            this.copySoundFiles(soundIndex, fileIndexes);
        });

        // Paste sound files
        this.request.listenRequest('paste-sound-files', (...args: any[]) => {
            const soundIndex = args[0];
            const fileIndexes = args[1];
            if (typeof soundIndex !== 'number' || !Array.isArray(fileIndexes)) {
                return;
            }
            this.pasteSoundFiles(soundIndex, fileIndexes);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Add a sound file
        this.request.listenRequest('add-sound-files', (...args: any[]) => {
            const soundIndex = args[0];
            const itemIndex = args[1];
            const files = args[2];
            if (
                typeof soundIndex !== 'number' ||
                typeof itemIndex !== 'number' ||
                !Array.isArray(files)
            ) {
                return;
            }
            this.addSoundFile(soundIndex, itemIndex, files);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Add a sound file
        this.request.listenRequest('change-sound-file', (...args: any[]) => {
            const soundIndex = args[0];
            const itemIndex = args[1];
            const file = args[2];
            if (
                typeof soundIndex !== 'number' ||
                typeof itemIndex !== 'number' ||
                typeof file !== 'string'
            ) {
                return;
            }
            this.changeSoundFile(soundIndex, itemIndex, file);
            writeDocument(document, formatKeyValues(this.kvList));
        });

        // Move sound files
        this.request.listenRequest('move-sound-files', (...args: any[]) => {
            const soundIndex = args[0];
            const fileIndexes = args[1];
            const targetIndex = args[2];
            const isTop = args[3];
            if (
                typeof soundIndex !== 'number' ||
                !Array.isArray(fileIndexes) ||
                typeof targetIndex !== 'number' ||
                typeof isTop !== 'boolean'
            ) {
                return;
            }
            let result = this.moveSoundFiles(
                soundIndex,
                fileIndexes,
                targetIndex,
                isTop
            );
            writeDocument(document, formatKeyValues(this.kvList));
            return result;
        });

        // Add or change a sound key
        this.request.listenRequest('change-sound-key', (...args: any[]) => {
            const soundIndex = args[0];
            const key = args[1];
            const value = args[2];
            if (
                typeof soundIndex !== 'number' ||
                typeof key !== 'string' ||
                typeof value !== 'string'
            ) {
                return;
            }
            this.changeSoundKeyValue(soundIndex, key, value);
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

        // Move sound events
        this.request.listenRequest('move-sound-events', (...args: any[]) => {
            const soundIndexes = args[0];
            const targetIndex = args[1];
            const isTop = args[2];
            if (
                !Array.isArray(soundIndexes) ||
                typeof targetIndex !== 'number' ||
                typeof isTop !== 'boolean'
            ) {
                return;
            }
            let result = this.moveSoundEvents(soundIndexes, targetIndex, isTop);
            writeDocument(document, formatKeyValues(this.kvList));
            return result;
        });

        // Dulpicate sound events
        this.request.listenRequest('duplicate-sound-events', (...args: any[]) => {
            const soundIndexes = args[0];
            if (!Array.isArray(soundIndexes)) {
                return;
            }
            this.duplicateSoundEvents(soundIndexes);
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

        const styleUri = webview.asWebviewUri(
            vscode.Uri.file(
                path.join(this.context.extensionPath, 'media/bundle/style.css')
            )
        );

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
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src 'nonce-${nonce}' ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <link href="${styleUri}" nonce="${nonce}" rel="stylesheet" />
                <script nonce="${nonce}">window._nonce_ = "${nonce}"</script>
                <script nonce="${nonce}" type="module" src="${indexJs}" defer></script>
            </head>
            <body class="bp3-dark">
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
