import React, { useEffect } from 'react';
import createCache from '@emotion/cache';

declare global {
    interface Window {
        _nonce_: string;
    }
}

export const editorCache = createCache({
    key: 'vscode-resource',
    nonce: window._nonce_,
    stylisPlugins: [],
});

interface IVscode {
    setState(data: any): void;
    getState(): any;
    postMessage(data: any): void;
}

// @ts-ignore
export const vscode: IVscode = acquireVsCodeApi();

const requestMap = new Map<number, Function>();
let requestCounter = 1;

// Send a request to vscode
export async function request<T>(label: string, ...args: any[]) {
    return new Promise<T>((resolve) => {
        let requestId = requestCounter++;
        requestMap.set(requestId, resolve);
        vscode.postMessage({
            requestId,
            label,
            args,
        });
    });
}

export function onRequestResponse(data: any) {
    if (typeof data.requestId === 'number') {
        let resolve = requestMap.get(data.requestId);
        if (resolve) {
            resolve(data.result);
            requestMap.delete(data.requestId);
        }
    }
}

/**
 * Use window.addEventListener
 */
export function useWindowEvent<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
) {
    useEffect(() => {
        window.addEventListener(type, listener, options);
        return () => {
            window.removeEventListener(type, listener);
        };
    });
}

export function onEnter(cb: (evt: React.KeyboardEvent) => void) {
    return (evt: React.KeyboardEvent) => {
        if (evt.key === 'Enter') {
            cb(evt);
        }
    };
}
