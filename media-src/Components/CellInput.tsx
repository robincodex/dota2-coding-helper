import { cx } from '@emotion/css';
import styled from '@emotion/styled';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BaseElementAttributes, InputState } from './utils';

type CellInputProps = BaseElementAttributes & {
    defaultValue?: string;
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
    /**
     * Trigger on enter or blur
     */
    onComplete?: (text: string) => void;
};

const Input = styled.input`
    border-radius: var(--panel-border-radius);
    outline: none;
    background: transparent;
    border: none;
    color: var(--vscode-editor-foreground);
    padding: 3px;
    box-sizing: border-box;
    width: 100%;
    display: none;
    line-height: 16px;

    &::placeholder {
        color: var(--vscode-input-placeholderForeground);
    }

    &:focus {
        outline: none;
    }

    &.error {
        color: var(--vscode-inputValidation-errorBorder);
    }
    &.warning {
        color: var(--vscode-inputValidation-warningBorder);
    }
`;

const InputDisplayText = styled.div`
    border-radius: var(--panel-border-radius);
    outline: none;
    background: transparent;
    border: none;
    color: var(--vscode-editor-foreground);
    padding: 3px;
    box-sizing: border-box;
    width: 100%;
    line-height: 16px;
`;

const InputContainer = styled.div`
    position: relative;

    &.editable {
        ${InputDisplayText} {
            display: none;
        }
        ${Input} {
            display: block;
        }
    }
`;

export function CellInput({
    renderValue,
    renderState,
    onChange,
    onComplete,
    stopKeyDownPropagation,
    defaultValue,
    className,
    ...props
}: CellInputProps) {
    defaultValue = defaultValue || '';
    const [value, setValue] = useState(renderValue ? renderValue(defaultValue) : defaultValue);
    const [inputState, setInputState] = useState(
        renderState ? renderState(defaultValue) : InputState.Normal
    );
    const [completeValue, setCompleteValue] = useState(value);
    const [editable, setEditable] = useState(false);
    const inputElement = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let v = defaultValue || '';
        v = renderValue ? renderValue(v) : v;
        setValue(v);
        setCompleteValue(v);
    }, [defaultValue]);

    useEffect(() => {
        if (editable) {
            if (inputElement.current) {
                inputElement.current.focus();
                inputElement.current.select();
            }
        }
    }, [editable]);

    return (
        <InputContainer
            className={cx({
                editable,
            })}
        >
            <Input
                type="text"
                value={value}
                ref={inputElement}
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
                    if (onComplete) {
                        if (evt.key === 'Enter') {
                            setEditable(false);
                            if (completeValue === value) {
                                return;
                            }
                            onComplete(value);
                            setCompleteValue(value);
                        }
                    }
                }}
                onBlur={() => {
                    setEditable(false);
                    if (onComplete) {
                        if (completeValue === value) {
                            return;
                        }
                        onComplete(value);
                        setCompleteValue(value);
                    }
                }}
            />
            <InputDisplayText
                onDoubleClick={() => {
                    setEditable(true);
                }}
            >
                {value}
            </InputDisplayText>
        </InputContainer>
    );
}
