import { cx } from '@emotion/css';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { X } from 'react-bootstrap-icons';
import { BaseElementAttributes } from './utils';

type DrawerProps = BaseElementAttributes & {
    title?: string;
    showable?: boolean;
    children?: React.ReactNode;
    onClose?: () => void;
};

const DrawerPanel = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    box-shadow: #000000 0px 0px 3px;
    background: var(--vscode-panel-background);
    border-left: 1px solid var(--vscode-panel-border);
    min-width: 200px;
    max-width: 70%;
    display: none;
    flex-direction: column;
    z-index: 11;

    &.showable {
        display: flex;
    }
`;

const DrawerHeader = styled.div`
    padding: 10px 15px;
    border-bottom: 1px solid var(--vscode-panel-border);
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;
`;

const DrawerHeaderText = styled.div`
    flex-grow: 1;
    font-size: 20px;
`;

const DrawerHeaderButton = styled.div`
    flex-shrink: 0;
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

const DrawerContent = styled.div`
    padding: 15px;
    flex-grow: 1;
    overflow-y: auto;
`;

export function Drawer({ showable, title, children, onClose, ...props }: DrawerProps) {
    return (
        <DrawerPanel className={cx({ showable })} {...props}>
            <DrawerHeader
                onClick={() => {
                    if (onClose) onClose();
                }}
            >
                <DrawerHeaderText>{title}</DrawerHeaderText>
                <DrawerHeaderButton>
                    <X />
                </DrawerHeaderButton>
            </DrawerHeader>
            <DrawerContent>{children}</DrawerContent>
        </DrawerPanel>
    );
}
