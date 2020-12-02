import { CacheProvider } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'react-bootstrap-icons';
import ReactDOM from 'react-dom';
import { editorCache, useWindowEvent } from '../utils';

function GetContextPanel() {
    let elem = document.getElementById('context-menu-panel');
    if (!elem) {
        elem = document.body.appendChild(document.createElement('div'));
        elem.id = 'context-menu-panel';
        elem.style.display = 'none';
        elem.style.position = 'fixed';
        elem.style.top = '0';
        elem.style.bottom = '0';
        elem.style.left = '0';
        elem.style.right = '0';
        elem.style.pointerEvents = 'none';
    }
    return elem;
}

export enum ContextMenuType {
    Normal,
    Separator,
}

export enum ContextMenuState {
    Display,
    Hidden,
}

export type ContextMenuData =
    | {
          type: ContextMenuType.Normal;
          id: number | string | symbol;
          text: string;
          hotkey?: string;
          submenu?: ContextMenuData;
      }
    | { type: ContextMenuType.Separator };

function ContextMenu(props: {
    menu: ContextMenuData[];
    offset: { top: number; left: number };
    onClick: (id: number | string | symbol) => void;
}) {
    let menuPanel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuPanel.current) {
            return;
        }
        const ctxPanel = GetContextPanel();
        ctxPanel.style.display = 'block';

        let top = props.offset.top;
        let left = props.offset.left;

        let panelRect = menuPanel.current.getBoundingClientRect();
        let bodyRect = ctxPanel.getBoundingClientRect();
        if (left + panelRect.width > bodyRect.width) {
            left -= panelRect.width;
        }
        if (top + panelRect.height > bodyRect.height) {
            top -= top + panelRect.height - bodyRect.height;
        }

        menuPanel.current.style.top = `${top}px`;
        menuPanel.current.style.left = `${left}px`;

        let first = true;
        const onClick = () => {
            CloseContextMenu();
        };
        const onRightClick = (evt: MouseEvent) => {
            if (first) {
                first = false;
                return;
            }
            if (evt.currentTarget) {
                CloseContextMenu();
            }
        };
        document.body.addEventListener('click', onClick);
        document.body.addEventListener('contextmenu', onRightClick);
        return () => {
            document.body.removeEventListener('click', onClick);
            document.body.removeEventListener('contextmenu', onRightClick);
        };
    });

    useWindowEvent('resize', () => {
        CloseContextMenu();
    });

    return (
        <MenuPanel ref={menuPanel}>
            {props.menu.map((v, i) => {
                if (v.type === ContextMenuType.Normal) {
                    return (
                        <MenuItem
                            key={i}
                            onClick={(event) => {
                                if (props.onClick) {
                                    props.onClick(v.id);
                                }
                            }}
                            onContextMenu={(event) => {
                                if (props.onClick) {
                                    props.onClick(v.id);
                                }
                            }}
                        >
                            <MenuItemIcon></MenuItemIcon>
                            <MenuItemText>{v.text}</MenuItemText>
                            <MenuItemHotKey>{v.hotkey}</MenuItemHotKey>
                            <MenuItemIcon>
                                {v.submenu ? <ChevronRight /> : null}
                            </MenuItemIcon>
                        </MenuItem>
                    );
                } else if (v.type === ContextMenuType.Separator) {
                    return <MenuSeparator key={i} />;
                }
            })}
        </MenuPanel>
    );
}

export function ShowContextMenu(props: {
    menu: ContextMenuData[];
    offset: { top: number; left: number };
    onClick: (id: number | string | symbol) => void;
}) {
    ReactDOM.render(
        <CacheProvider value={editorCache}>
            <ContextMenu {...props} />
        </CacheProvider>,
        GetContextPanel()
    );
}

export function CloseContextMenu() {
    GetContextPanel().style.display = 'none';
}

const MenuPanel = styled.div`
    display: flex;
    position: fixed;
    flex-direction: column;
    background: var(--vscode-menu-background);
    box-shadow: 0px 3px 3px #000000;
    min-width: 200px;
    padding: 5px 0px;
    user-select: none;
    pointer-events: auto;
    color: var(--vscode-menu-foreground);

    &.Hidden {
        display: none;
    }
`;

const MenuItem = styled.div`
    padding: 3px 10px;
    display: flex;
    flex-direction: row;
    color: inherit;

    &:hover {
        color: var(--vscode-menu-selectionForeground);
        background: var(--vscode-menu-selectionBackground);
    }
`;

const MenuItemText = styled.div`
    flex-grow: 1;
    margin-right: 15px;
`;

const MenuItemHotKey = styled.div`
    flex-shrink: 0;
`;

const MenuItemIcon = styled.div`
    width: 13px;
    flex-shrink: 0;
    text-align: center;

    &:first-of-type {
        margin-right: 2px;
    }

    &:last-child {
        margin-left: 2px;
        min-width: 15px;
    }

    & svg {
        vertical-align: -2px;
    }
`;

const MenuSeparator = styled.div`
    margin: 4px 10px;
    height: 1px;
    background: var(--vscode-textSeparator-foreground);
`;
