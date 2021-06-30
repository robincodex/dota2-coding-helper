import * as vscode from 'vscode';
import { KeyValues3 } from 'easy-keyvalues';
import { Disposable } from './dispose';

/**
 * 用于表示类
 */
interface ITypeofClass<T = {}> {
    new (...args: any[]): T;
}

export class KeyValues3Document extends Disposable implements vscode.CustomDocument {
    public static async create<R>(
        ctor: ITypeofClass<R>,
        uri: vscode.Uri,
        backupId: string | undefined
    ): Promise<R | PromiseLike<R>> {
        // If we have a backup, read that. Otherwise read the resource from the workspace
        const dataFile = typeof backupId === 'string' ? vscode.Uri.parse(backupId) : uri;
        const kv3 = await KeyValues3Document.readFile(dataFile);
        return new ctor(uri, kv3);
    }

    public static async readFile(uri: vscode.Uri): Promise<KeyValues3> {
        if (uri.scheme === 'untitled') {
            return KeyValues3.CreateRoot();
        }
        const fileData = await vscode.workspace.fs.readFile(uri);
        const kv3 = KeyValues3.Parse(new TextDecoder().decode(fileData));
        return kv3;
    }

    /**
     * The associated uri for this document.
     */
    protected readonly _uri: vscode.Uri;

    public get uri() {
        return this._uri;
    }

    /**
     * Dispose of the custom document.
     *
     * This is invoked by VS Code when there are no more references to a given `CustomDocument` (for example when
     * all editors associated with the document have been closed.)
     */
    public dispose(): void {
        this._onDidDispose.fire();
        super.dispose();
    }

    /**
     * The root of KeyValues3
     */
    protected _kvRoot: KeyValues3;

    public get Root() {
        return this._kvRoot;
    }

    protected _edits: Array<KeyValues3> = [];
    protected _savedEdits: Array<KeyValues3> = [];

    protected constructor(uri: vscode.Uri, initialKV: KeyValues3) {
        super();
        this._uri = uri;
        this._kvRoot = initialKV;
    }

    protected readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
    /**
     * Fired when the document is disposed of.
     */
    public readonly onDidDispose = this._onDidDispose.event;

    protected readonly _onDidChangeDocument = this._register(
        new vscode.EventEmitter<{
            readonly content?: Uint8Array;
            readonly edits: readonly KeyValues3[];
        }>()
    );
    /**
     * Fired to notify webviews that the document has changed.
     */
    public readonly onDidChangeContent = this._onDidChangeDocument.event;

    protected readonly _onDidChange = this._register(
        new vscode.EventEmitter<{
            readonly label: string;
            undo(): void;
            redo(): void;
        }>()
    );
    /**
     * Fired to tell VS Code that an edit has occured in the document.
     *
     * This updates the document's dirty indicator.
     */
    public readonly onDidChange = this._onDidChange.event;

    /**
     * Called by VS Code when the user saves the document.
     */
    async save(cancellation: vscode.CancellationToken): Promise<void> {
        await this.saveAs(this.uri, cancellation);
        this._savedEdits = Array.from(this._edits);
    }

    /**
     * Called by VS Code when the user saves the document to a new location.
     */
    async saveAs(
        targetResource: vscode.Uri,
        cancellation: vscode.CancellationToken
    ): Promise<void> {
        const fileData = new TextEncoder().encode(this._kvRoot.toString());
        if (cancellation.isCancellationRequested) {
            return;
        }
        await vscode.workspace.fs.writeFile(targetResource, fileData);
    }

    /**
     * Called by VS Code when the user calls `revert` on a document.
     */
    async revert(_cancellation: vscode.CancellationToken): Promise<void> {
        const kv3 = await KeyValues3Document.readFile(this.uri);
        this._kvRoot = kv3;
        this._edits = this._savedEdits;
        // this._onDidChangeDocument.fire({
        //     content: diskContent,
        //     edits: this._edits,
        // });
    }

    /**
     * Called by VS Code to backup the edited document.
     *
     * These backups are used to implement hot exit.
     */
    async backup(
        destination: vscode.Uri,
        cancellation: vscode.CancellationToken
    ): Promise<vscode.CustomDocumentBackup> {
        await this.saveAs(destination, cancellation);

        return {
            id: destination.toString(),
            delete: async () => {
                try {
                    await vscode.workspace.fs.delete(destination);
                } catch {
                    // noop
                }
            },
        };
    }
}
