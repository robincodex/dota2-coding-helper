import styled from '@emotion/styled';

export const Button = styled.button`
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    outline: none;
    border: none;
    padding: 5px 8px;
    min-width: 88px;

    &:hover {
        background: var(--vscode-button-hoverBackground);
    }
`;

export const ButtonGroup = styled.div`
    display: inline-block;

    ${Button} {
        &:not(:last-child) {
            margin-right: 10px;
        }
    }
`;
