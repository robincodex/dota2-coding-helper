import { CacheProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { X } from 'react-bootstrap-icons';
import ReactDOM from 'react-dom';
import { editorCache } from '../utils';
import { Button, ButtonGroup } from './Button';
import { Textarea } from './Textarea';
import { TextInput } from './TextInput';
import { InputState } from './utils';

function GetContextPanel() {
    let elem = document.getElementById('modal-dialog-panel');
    if (!elem) {
        elem = document.body.appendChild(document.createElement('div'));
        elem.id = 'modal-dialog-panel';
        elem.style.display = 'none';
        elem.style.position = 'fixed';
        elem.style.top = '0';
        elem.style.bottom = '0';
        elem.style.left = '0';
        elem.style.right = '0';
        elem.style.background = '#00000050';
        elem.style.pointerEvents = 'none';
        elem.style.justifyContent = 'center';
        elem.style.alignItems = 'center';
    }
    return elem;
}

export interface IModalDialogMethods {
    close(): void;
}

function ModalDialog(props: { children: React.ReactNode; title?: string }) {
    useEffect(() => {
        const ctxPanel = GetContextPanel();
        ctxPanel.style.display = 'flex';
        ctxPanel.style.pointerEvents = 'auto';
        const btns = ctxPanel.querySelectorAll(`[data-dialog-close="true"]`);
        for (const [_, btn] of btns.entries()) {
            btn.addEventListener('click', CloseModalDialog);
        }
        return () => {
            for (const [_, btn] of btns.entries()) {
                btn.removeEventListener('click', CloseModalDialog);
            }
        };
    });

    return (
        <DialogPanel>
            <DialogTopBar>
                <DialogTitle style={{ flexGrow: 1 }}>{props.title}</DialogTitle>
                <div style={{ flexShrink: 0 }}>
                    <DialogTopButton onClick={CloseModalDialog}>
                        <X />
                    </DialogTopButton>
                </div>
            </DialogTopBar>
            <DialogContent>{props.children}</DialogContent>
        </DialogPanel>
    );
}

/**
 * If you need the close button, you can add `data-dialog-close` to the button
 *
 * Example:
 * ```
 * <Button data-dialog-close>Cancel</Button>
 * ```
 */
export function ShowModalDialog(content: React.ReactNode, options: { title?: string }) {
    ReactDOM.render(
        <CacheProvider value={editorCache}>
            <ModalDialog title={options.title}>{content}</ModalDialog>
        </CacheProvider>,
        GetContextPanel()
    );
}

export function CloseModalDialog() {
    const ctxPanel = GetContextPanel();
    ctxPanel.style.display = 'none';
    ctxPanel.style.pointerEvents = 'none';
}

/**
 * Show single input dialog
 */
export function ShowInputDialog(option: {
    title: string;
    label?: string;
    ok: (text: string) => void;
    cancel?: () => void;
    renderValue?: (text: string) => string;
    renderState?: (text: string) => InputState;
}) {
    let value = '';
    ShowModalDialog(
        <div>
            <div>
                <TextInput
                    label={option.label}
                    defaultValue={value}
                    defaultFocus
                    onChange={(text) => {
                        value = text;
                    }}
                    renderState={option.renderState}
                    renderValue={option.renderValue}
                    onComplete={(text, isEnter) => {
                        if (isEnter) {
                            option.ok(text);
                            CloseModalDialog();
                        }
                    }}
                />
            </div>
            <div style={{ textAlign: 'right' }}>
                <ButtonGroup>
                    <Button
                        data-dialog-close
                        onClick={() => {
                            option.ok(value);
                        }}
                    >
                        OK
                    </Button>
                    <Button
                        data-dialog-close
                        onClick={() => {
                            if (option.cancel) {
                                option.cancel();
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </ButtonGroup>
            </div>
        </div>,
        { title: option.title }
    );
}

/**
 * Show single textarea dialog
 */
export function ShowTextareaDialog(option: {
    title: string;
    label?: string;
    width?: number;
    height?: number;
    ok: (text: string) => void;
    cancel?: () => void;
    renderValue?: (text: string) => string;
    renderState?: (text: string) => InputState;
}) {
    let value = '';
    ShowModalDialog(
        <div>
            <div>
                <div style={{ marginBottom: 3 }}>{option.label}</div>
                <Textarea
                    style={{ width: option.width, height: option.height }}
                    defaultValue={value}
                    defaultFocus
                    onChange={(text) => {
                        value = text;
                    }}
                    renderState={option.renderState}
                    renderValue={option.renderValue}
                />
            </div>
            <div style={{ textAlign: 'right' }}>
                <ButtonGroup>
                    <Button
                        data-dialog-close
                        onClick={() => {
                            option.ok(value);
                        }}
                    >
                        OK
                    </Button>
                    <Button
                        data-dialog-close
                        onClick={() => {
                            if (option.cancel) {
                                option.cancel();
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </ButtonGroup>
            </div>
        </div>,
        { title: option.title }
    );
}

const DialogPanel = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid var(--vscode-panel-border);
    flex-shrink: 0;
    user-select: none;
    border-radius: var(--panel-border-radius);
    background: var(--vscode-editorWidget-background);
    outline: none;
    overflow: hidden;
    pointer-events: auto;
    box-shadow: #000 0px 0px 2px;
`;

const DialogTopBar = styled.div`
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid var(--vscode-panel-border);
    flex-shrink: 0;
`;

const DialogTitle = styled.div`
    line-height: 42px;
    padding: 0px 8px;
    font-size: 15px;
`;

const DialogTopButton = styled.div`
    border: 1px solid transparent;
    margin: 5px;
    border-radius: var(--panel-border-radius);
    font-size: 35px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        border: 1px solid var(--vscode-panel-border);
    }
`;

const DialogContent = styled.div`
    min-height: 50px;
    min-width: 300px;
    user-select: text;
    padding: 8px;
`;
