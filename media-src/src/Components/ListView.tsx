import styled from '@emotion/styled';
import { css, cx } from '@emotion/css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BaseElementAttributes } from './utils';
import { ThreeDots } from 'react-bootstrap-icons';

/**
 * The data format of each row of the list item
 */
export type ListViewItemData<T> = { key: T; content: React.ReactNode };

export interface ListViewMethods<T> {
    selectAll(): void;
    select(keys: T[]): void;
}

type ListViewProps<T> = BaseElementAttributes & {
    title: string;
    smallTitle?: boolean;
    titleMenu?: { id: string | number | symbol; text: string }[];
    titleStyle?: BaseElementAttributes['style'];
    items: ListViewItemData<T>[];
    onSelected?: (keys: T[]) => void;
    onContextMenu?: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        keys: T[],
        methods: ListViewMethods<T>
    ) => void;
    onKeyDown?: (
        event: React.KeyboardEvent<HTMLDivElement>,
        keys: T[],
        methods: ListViewMethods<T>
    ) => void;
    onMoveItems?: (
        keys: T[],
        target: T,
        isTop: boolean,
        methods: ListViewMethods<T>
    ) => void;
};

/**
 * ListView
 */
export function ListView<T>({
    title,
    items,
    smallTitle,
    titleMenu,
    titleStyle,
    onSelected,
    onContextMenu,
    onKeyDown,
    onMoveItems,
    ...props
}: ListViewProps<T>) {
    const [selectedState, setSelectedState] = useState<T[]>([]);
    const root = useRef<HTMLDivElement>(null);

    // Check the keys are all unique
    const unique = new Map<T, boolean>();
    const areAllUnique = items.every((v) => {
        if (unique.get(v.key)) {
            return false;
        }
        unique.set(v.key, true);
        return true;
    });
    if (!areAllUnique) {
        return (
            <ListViewRoot {...props}>
                <ListViewTitle>{title}</ListViewTitle>
                <ListViewItemList>The key must be unique</ListViewItemList>
            </ListViewRoot>
        );
    }

    // Create methods of ListView
    const listViewsmethods: ListViewMethods<T> = {
        /**
         * Select all items
         */
        selectAll(): void {
            const list = items.map((v) => v.key);
            setSelectedState(list);
            if (onSelected) {
                onSelected(list);
            }
        },
        select(keys: T[]): void {
            setSelectedState(keys);
            if (onSelected) {
                onSelected(keys);
            }
        },
    };

    let dragKeys: T[] = [];
    let dropIsTop = false;

    // Normal
    return (
        <ListViewRoot {...props} ref={root} tabIndex={0} onKeyDown={onKeyDownHandle}>
            <ListViewTitle
                className={cx({
                    small: smallTitle === true,
                    hasTitleMenu: !!titleMenu,
                })}
                style={titleStyle}
            >
                {title}
                {titleMenu ? (
                    <ListViewTitleMenu>
                        <ThreeDots />
                    </ListViewTitleMenu>
                ) : null}
            </ListViewTitle>
            <ListViewItemList>
                {items.map((v, i) => {
                    let isSelected = selectedState.includes(v.key);
                    return (
                        <ListViewItem
                            key={i}
                            className={isSelected ? 'selected' : ''}
                            onClick={onItemClick(v)}
                            onContextMenu={onItemContextMenu(v)}
                            draggable={!!onMoveItems}
                            onDragStart={onDragStart(v)}
                            onDragEnd={onDragEnd()}
                            onDragOver={(evt) => {
                                evt.preventDefault();
                            }}
                        >
                            {v.content}
                            <ListViewItemDragPanel
                                onDragEnter={(evt) => {
                                    evt.preventDefault();
                                }}
                                onDragLeave={onDragLeave()}
                                onDragOver={onDragOver()}
                                onDrop={onDrop(v)}
                            />
                        </ListViewItem>
                    );
                })}
            </ListViewItemList>
        </ListViewRoot>
    );

    // Start move items
    function onDragStart(v: ListViewItemData<T>) {
        if (!onMoveItems) {
            return;
        }
        return (evt: React.DragEvent<HTMLDivElement>) => {
            const dragPanel = document.createElement('div');
            dragPanel.id = 'custom-draggable-element';
            dragPanel.style.padding = '5px';
            dragPanel.style.background = '#000';
            dragPanel.style.borderRadius = '1000px';
            dragPanel.style.position = 'absolute';
            dragPanel.style.top = '-99999px';
            document.body.appendChild(dragPanel);
            evt.dataTransfer.setDragImage(dragPanel, -11, -11);
            root.current?.classList?.add('drag-start');
            dropIsTop = false;

            if (evt.currentTarget.classList.contains('selected')) {
                dragPanel.innerText = selectedState.length.toString();
                dragKeys = [...selectedState];
            } else {
                dragPanel.innerText = '1';
                dragKeys = [v.key];
            }
        };
    }

    // End of move items
    function onDragEnd() {
        if (!onMoveItems) {
            return;
        }
        return () => {
            const elem = document.getElementById('custom-draggable-element');
            if (elem) {
                elem.parentElement?.removeChild(elem);
            }
            root.current?.classList?.remove('drag-start');
        };
    }

    function onDragLeave() {
        if (!onMoveItems) {
            return;
        }
        return (evt: React.DragEvent<HTMLDivElement>) => {
            evt.preventDefault();
            evt.currentTarget.classList.remove('drag-enter-top');
            evt.currentTarget.classList.remove('drag-enter-bottom');
        };
    }

    // Set dropIsTop
    function onDragOver() {
        if (!onMoveItems) {
            return;
        }
        return (evt: React.DragEvent<HTMLDivElement>) => {
            evt.preventDefault();
            const rect = evt.currentTarget.getBoundingClientRect();
            const mid = rect.y + rect.height / 2;
            if (evt.clientY < mid) {
                dropIsTop = true;
                evt.currentTarget.classList.add('drag-enter-top');
                evt.currentTarget.classList.remove('drag-enter-bottom');
            } else {
                dropIsTop = false;
                evt.currentTarget.classList.add('drag-enter-bottom');
                evt.currentTarget.classList.remove('drag-enter-top');
            }
        };
    }

    // Trigger onMoveItems
    function onDrop(v: ListViewItemData<T>) {
        if (!onMoveItems) {
            return;
        }
        return (evt: React.DragEvent<HTMLDivElement>) => {
            evt.preventDefault();
            evt.currentTarget.classList.remove('drag-enter-top');
            evt.currentTarget.classList.remove('drag-enter-bottom');
            onMoveItems(dragKeys, v.key, dropIsTop, listViewsmethods);
        };
    }

    /**
     * onKeyDown
     */
    function onKeyDownHandle(evt: React.KeyboardEvent<HTMLDivElement>) {
        if (onKeyDown) {
            onKeyDown(evt, [...selectedState], listViewsmethods);
        }
    }

    /**
     * On right click the ListViewItem
     */
    function onItemContextMenu(v: ListViewItemData<T>) {
        return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (onContextMenu) {
                if (!selectedState.includes(v.key)) {
                    const list = [v.key];
                    setSelectedState(list);
                    if (onSelected) {
                        onSelected(list);
                    }
                    onContextMenu(event, list, listViewsmethods);
                } else {
                    onContextMenu(event, [...selectedState], listViewsmethods);
                }
            }
        };
    }

    /**
     * On click the ListViewItem
     */
    function onItemClick(v: ListViewItemData<T>) {
        return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (event.ctrlKey && selectedState.length > 0) {
                // Select multiple items on Ctrl + Left Click
                if (selectedState.includes(v.key)) {
                    selectedState.splice(selectedState.indexOf(v.key), 1);
                    const list = [...selectedState];
                    setSelectedState(list);
                    if (onSelected) {
                        onSelected(list);
                    }
                } else {
                    const list = [...selectedState, v.key];
                    setSelectedState(list);
                    if (onSelected) {
                        onSelected(list);
                    }
                }
            } else if (event.shiftKey && selectedState.length > 0) {
                // Select continuous multiple items on Shift + Left Click
                let i = items.findIndex((v2) => selectedState.includes(v2.key));
                let vi = items.findIndex((v2) => v2.key === v.key);
                const list: T[] = [];
                if (vi < i) {
                    list.push(
                        ...items.slice(vi, i).map((v) => v.key),
                        ...selectedState
                    );
                } else if (vi > i) {
                    let j = Array.from(items)
                        .reverse()
                        .findIndex(
                            (v2) => selectedState.includes(v2.key) || v2.key === v.key
                        );
                    j = items.length - j - 1;
                    list.push(...items.slice(i, j + 1).map((v) => v.key));
                }
                setSelectedState(list);
                if (onSelected) {
                    onSelected(list);
                }
            } else {
                // Select single item on Left Click
                const list = [v.key];
                setSelectedState(list);
                if (onSelected) {
                    onSelected(list);
                }
            }
        };
    }
}

const ListViewTitleMenu = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 9px 5px;
    cursor: pointer;
`;

const ListViewTitle = styled.div`
    color: var(--vscode-panelTitle-activeForeground);
    font-size: 16px;
    padding: 8px 20px;
    user-select: none;
    border-bottom: 1px solid var(--vscode-panel-border);
    /* text-align: center; */
    position: relative;

    &.hasTitleMenu {
        padding-right: 40px;
    }

    &.small {
        font-size: 14px;
        padding: 3px;

        ${ListViewTitleMenu} {
            padding: 4px 5px;
        }
    }
`;

const ListViewItemList = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 16px;
`;

const ListViewItem = styled.div`
    cursor: pointer;
    position: relative;

    &:hover {
        color: var(--vscode-list-hoverForeground);
        background: var(--vscode-list-hoverBackground);
    }

    &.selected {
        color: var(--vscode-list-focusForeground);
        background: var(--vscode-list-focusBackground);
    }
`;

const ListViewItemDragPanel = styled.div`
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-style: none;
    border: 1px solid transparent;

    &.drag-enter-top {
        border: 1px solid var(--vscode-terminal-ansiBrightGreen);
        border-style: dashed none none none;
    }
    &.drag-enter-bottom {
        border: 1px solid var(--vscode-terminal-ansiBrightGreen);
        border-style: none none dashed none;
    }
`;

const ListViewRoot = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid var(--vscode-panel-border);
    flex-shrink: 0;
    user-select: none;
    border-radius: var(--panel-border-radius);
    /* background: var(--vscode-editorWidget-background); */
    outline: none;
    overflow: hidden;

    &:not(:focus) {
        ${ListViewItem}.selected {
            color: var(--vscode-list-hoverForeground);
            background: var(--vscode-list-hoverBackground);
        }
    }

    &.drag-start {
        ${ListViewItemDragPanel} {
            display: block;
        }
    }
`;
