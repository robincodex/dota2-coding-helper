import * as vscode from 'vscode';

export function GetNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function locale(): string {
    const config = JSON.parse(String(process.env.VSCODE_NLS_CONFIG));
    return config['locale'] || 'en';
}

/**
 * Help you interact with the view.
 */
export class RequestHelper {
    private _requestMap = new Map<string, Function>();

    public clear() {
        this._requestMap.clear();
    }

    public listenRequest(label: string, cb: Function) {
        this._requestMap.set(label, cb);
    }

    public onRequest(e: any, webview: vscode.Webview) {
        if (e.label && e.requestId) {
            let cb = this._requestMap.get(e.label);
            if (cb) {
                let result = cb(...e.args);
                webview.postMessage({
                    requestId: e.requestId,
                    result,
                });
            }
        }
    }
}

export function writeDocument(document: vscode.TextDocument, text: string) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), text);
    vscode.workspace.applyEdit(edit);
}

export function initializeKV3ToDocument(document: vscode.TextDocument) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(
        document.uri,
        new vscode.Range(0, 0, document.lineCount, 0),
        `<!-- kv3 encoding:text:version{e21c7f3c-8a33-41c5-9977-a76d3a32aa0d} format:generic:version{7412167c-06e9-4698-aff2-e63eb59037e7} -->
{
}`
    );
    vscode.workspace.applyEdit(edit);
}

export function cloneObject(src: any): any {
    if (Array.isArray(src)) {
        let ary: any[] = Object.assign([], src);
        for (let i = 0; i < ary.length; i++) {
            const child = ary[i];
            if (typeof child === 'object') {
                ary[i] = cloneObject(child);
            }
        }
        return ary;
    }
    let obj = Object.assign({}, src);
    for (const k in obj) {
        const child = obj[k];
        if (typeof child === 'object') {
            obj[k] = cloneObject(child);
        }
    }
    return obj;
}

/**
 * Register class methods for vscode post message.
 */
export function PostMethod() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (typeof descriptor.value !== 'function') {
            throw Error(`PostMethod: Not function ${target.name}:${propertyKey}`);
        }
    };
}
