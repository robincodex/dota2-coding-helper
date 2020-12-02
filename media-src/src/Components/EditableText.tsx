import { cx } from '@emotion/css';
import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import { BaseElementAttributes, InputState } from './utils';

type EditableTextProps = BaseElementAttributes & {
    defaultValue?: string;
    noBorder?: boolean;
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

    &:focus {
        outline: none;
        box-shadow: var(--vscode-editor-foreground) 0px 0px 3px;
    }

    &.noBorder {
        box-shadow: none;
    }

    &.error {
        color: var(--vscode-inputValidation-errorBorder);
    }
    &.warning {
        color: var(--vscode-inputValidation-warningBorder);
    }
`;

export function EditableText({
    renderValue,
    renderState,
    onChange,
    onComplete,
    defaultValue,
    noBorder,
    className,
    ...props
}: EditableTextProps) {
    defaultValue = defaultValue || '';
    const [value, setValue] = useState(
        renderValue ? renderValue(defaultValue) : defaultValue
    );
    const [inputState, setInputState] = useState(
        renderState ? renderState(defaultValue) : InputState.Normal
    );
    const [completeValue, setCompleteValue] = useState(value);

    return (
        <Input
            type="text"
            value={value}
            className={cx(className, {
                noBorder: noBorder === true,
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
                if (onComplete) {
                    if (completeValue === value) {
                        return;
                    }
                    if (evt.key === 'Enter') {
                        onComplete(value);
                        setCompleteValue(value);
                    }
                }
            }}
            onBlur={() => {
                if (onComplete) {
                    if (completeValue === value) {
                        return;
                    }
                    onComplete(value);
                    setCompleteValue(value);
                }
            }}
        />
    );
}
