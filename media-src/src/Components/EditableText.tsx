import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import { BaseElementAttributes } from './utils';

type EditableTextProps = BaseElementAttributes & {
    defaultValue?: string;
    renderValue?: (text: string) => string;
    onChange?: (text: string) => void;
};

const Input = styled.input`
    border-radius: var(--panel-border-radius);
    outline: none;
    background: transparent;
    border: none;
    color: var(--vscode-editor-foreground);
    padding: 5px;

    &:focus {
        outline: none;
        box-shadow: var(--vscode-editor-foreground) 0px 0px 3px;
    }
`;

export function EditableText({
    renderValue,
    onChange,
    defaultValue,
    ...props
}: EditableTextProps) {
    const [value, setValue] = useState(defaultValue || '');

    return (
        <Input
            type="text"
            value={renderValue ? renderValue(value) : value}
            {...props}
            onChange={(evt) => {
                setValue(evt.currentTarget.value);
            }}
        />
    );
}
