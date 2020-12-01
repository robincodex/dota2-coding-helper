import { cx } from '@emotion/css';
import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import { BaseElementAttributes, searchString } from './utils';

type TextInputProps = BaseElementAttributes & {
    defaultValue?: string;
    inline?: boolean;
    label?: string;
    searchTexts?: string[];
    renderValue?: (text: string) => string;
    onChange?: (text: string) => void;
};

export function TextInput({
    renderValue,
    onChange,
    defaultValue,
    inline,
    label,
    searchTexts,
    ...props
}: TextInputProps) {
    const [value, setValue] = useState(defaultValue || '');

    return (
        <InputContainer
            className={cx({
                inline: inline === true,
            })}
        >
            <InputLabel>{label}</InputLabel>
            <InputBox>
                <Input
                    type="text"
                    value={renderValue ? renderValue(value) : value}
                    {...props}
                    onChange={(evt) => {
                        setValue(evt.currentTarget.value);
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
