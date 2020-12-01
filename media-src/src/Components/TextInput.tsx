import { cx } from '@emotion/css';
import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import { BaseElementAttributes, searchString } from './utils';

export enum InputState {
    Normal,
    Error,
    Warning,
}

export const InputNumberFilter = /\-?\d+(\.\d+)?/;

export const InputPositiveNumberFilter = /\d+(\.\d+)?/;

export function renderNumericState(text: string): InputState {
    if (InputNumberFilter.exec(text)?.shift() === text) {
        return InputState.Normal;
    }
    return InputState.Error;
}

export function renderPositiveNumericState(text: string): InputState {
    if (InputPositiveNumberFilter.exec(text)?.shift() === text) {
        return InputState.Normal;
    }
    return InputState.Error;
}

type TextInputProps = BaseElementAttributes & {
    defaultValue?: string;
    inline?: boolean;
    label?: string;
    searchTexts?: string[];
    renderValue?: (text: string) => string;
    renderState?: (text: string) => InputState;
    onChange?: (text: string) => void;
};

export function TextInput({
    renderValue,
    renderState,
    onChange,
    defaultValue,
    inline,
    label,
    searchTexts,
    className,
    ...props
}: TextInputProps) {
    defaultValue = defaultValue || '';
    const [value, setValue] = useState(
        renderValue ? renderValue(defaultValue) : defaultValue
    );
    const [inputState, setInputState] = useState(
        renderState ? renderState(defaultValue) : InputState.Normal
    );

    return (
        <InputContainer
            className={cx({
                inline: inline === true,
            })}
        >
            <InputLabel>{label}</InputLabel>
            <InputBox>
                <Input
                    className={cx(className, {
                        error: inputState === InputState.Error,
                        warning: inputState === InputState.Warning,
                    })}
                    type="text"
                    value={value}
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
                />
                {searchTexts ? (
                    <SearchMenu>
                        {searchTexts
                            .filter((v) => {
                                if (!value) {
                                    return true;
                                }
                                return searchString(v, value);
                            })
                            .map((v, i) => {
                                return (
                                    <SearchItem
                                        key={i}
                                        onMouseDown={(evt) => {
                                            setValue(v);
                                        }}
                                    >
                                        {v}
                                    </SearchItem>
                                );
                            })}
                    </SearchMenu>
                ) : null}
            </InputBox>
        </InputContainer>
    );
}

const InputLabel = styled.div`
    font-size: 13px;
    line-height: 25px;
    color: var(--vscode-input-foreground);
    margin-bottom: 3px;
`;

const Input = styled.input`
    outline: none;
    color: var(--vscode-input-foreground);
    line-height: 18px;
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-background);
    display: flex;
    flex-direction: row;
    border-radius: var(--panel-border-radius);
    padding: 3px;

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

const InputBox = styled.div`
    position: relative;
`;

const SearchMenu = styled.div`
    position: absolute;
    top: 28px;
    left: 0px;
    right: 0px;
    background: var(--vscode-input-background);
    overflow: hidden auto;
    z-index: 10;
    display: none;
    min-height: 30px;
    max-height: 150px;

    ${Input}:focus+& {
        display: block;
    }
`;

const SearchItem = styled.div`
    padding: 2px 5px;

    &:hover {
        color: var(--vscode-list-focusForeground);
        background: var(--vscode-list-focusBackground);
    }
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: var(--base-gap);

    &:not(:last-child) {
        margin-right: var(--base-gap);
    }

    &.inline {
        flex-direction: row;
        ${InputLabel} {
            margin-right: 3px;
            margin-bottom: 0px;
        }
    }
`;
