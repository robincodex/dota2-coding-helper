import { cx } from '@emotion/css';
import styled from '@emotion/styled';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BaseElementAttributes, InputState } from './utils';

type TextareaProps = BaseElementAttributes & {
    defaultValue?: string;
    defaultFocus?: boolean;
    stopKeyDownPropagation?: boolean;
    /**
     * Render value, same as filter value
     */
    renderValue?: (text: string) => string;
    /**
     * Render text color
     */
    renderState?: (text: string) => InputState;
    /**
     * Trigger on any char change
     */
    onChange?: (text: string) => void;
};

const Input = styled.textarea`
    border-radius: var(--panel-border-radius);
    outline: none;
    background: transparent;
    color: var(--vscode-editor-foreground);
    padding: 3px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid var(--vscode-input-background);
    font-family: var(--vscode-font-family);

    &::placeholder {
        color: var(--vscode-input-placeholderForeground);
    }

    &:focus {
        outline: none;
        border: 1px solid var(--vscode-inputValidation-infoBorder);
    }

    &.error {
        border: 1px solid var(--vscode-inputValidation-errorBorder);
    }
    &.warning {
        border: 1px solid var(--vscode-inputValidation-warningBorder);
    }
`;

export function Textarea({
    renderValue,
    renderState,
    onChange,
    stopKeyDownPropagation,
    defaultValue,
    defaultFocus,
    className,
    ...props
}: TextareaProps) {
    defaultValue = defaultValue || '';
    const [value, setValue] = useState(renderValue ? renderValue(defaultValue) : defaultValue);
    const [inputState, setInputState] = useState(
        renderState ? renderState(defaultValue) : InputState.Normal
    );
    const inputElement = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        let v = defaultValue || '';
        v = renderValue ? renderValue(v) : v;
        setValue(v);
    }, [defaultValue]);

    useEffect(() => {
        if (defaultFocus) {
            setTimeout(() => {
                inputElement.current?.focus();
            });
        }
    });

    return (
        <Input
            ref={inputElement}
            value={value}
            className={cx(className, {
                error: inputState === InputState.Error,
                warning: inputState === InputState.Warning,
            })}
            {...props}
            onChange={(evt) => {
                let v = evt.currentTarget.value;
                v = renderValue ? renderValue(v) : v;
                setValue(v);
                if (renderState) {
                    setInputState(renderState(v));
                }
                if (onChange) {
                    onChange(v);
                }
            }}
            onKeyDown={(evt) => {
                if (stopKeyDownPropagation) {
                    evt.stopPropagation();
                }
                if (evt.ctrlKey) {
                    switch (evt.key) {
                        case 'z':
                        case 'x':
                        case 'y':
                            evt.stopPropagation();
                            break;
                    }
                }
            }}
        />
    );
}
