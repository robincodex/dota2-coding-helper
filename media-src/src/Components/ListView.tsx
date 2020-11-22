import styled from '@emotion/styled';
import { useState } from 'react';

const ListViewRoot = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #303030;
    flex-shrink: 0;
    user-select: none;
`;

const ListViewTitle = styled.div`
    font-size: 16px;
    padding: 5px;
    user-select: none;
    background: #111111;
    border-bottom: 1px solid #303030;
    text-align: center;
`;

const ListViewContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const ListViewItem = styled.div`
    padding: 5px;
    cursor: pointer;
    position: relative;

    &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
    }

    &:hover {
        &::after {
            background: #33333350;
        }
    }

    &.selected {
        &::after {
            background: #006eff50;
        }
    }
`;

export type ListViewItemData = { key: string | number; content: React.ReactNode };

export function ListView(props: {
    title: string;
    items: ListViewItemData[];
    className?: string;
    style?: React.CSSProperties;
    onSelected: (keys: (string | number)[]) => void;
    onContextMenu?: (key: string | number, itemElement: HTMLDivElement) => void;
}) {
    const [selectedState, setSelectedState] = useState<(string | number)[]>([]);

    // Check the keys are all unique
    const unique: Record<ListViewItemData['key'], boolean> = {};
    const areAllUnique = props.items.every((v) => {
        if (unique[v.key]) {
            return false;
        }
        unique[v.key] = true;
        return true;
    });
    if (!areAllUnique) {
        return (
            <ListViewRoot>
                <ListViewTitle>{props.title}</ListViewTitle>
                <ListViewContent>The key must be unique</ListViewContent>
            </ListViewRoot>
        );
    }

    // Normal
    return (
        <ListViewRoot className={props.className} style={props.style}>
            <ListViewTitle>{props.title}</ListViewTitle>
            <ListViewContent>
                {props.items.map((v, i) => {
                    let isSelected = selectedState.includes(v.key);
                    return (
                        <ListViewItem
                            key={i}
                            className={isSelected ? 'selected' : ''}
                            onClick={onItemClick(v)}
                            onContextMenu={onItemContextMenu(v)}
                        >
                            {v.content}
                        </ListViewItem>
                    );
                })}
            </ListViewContent>
        </ListViewRoot>
    );

    /**
     * On right click the ListViewItem
     */
    function onItemContextMenu(v: ListViewItemData) {
        return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            if (props.onContextMenu) {
                props.onContextMenu(v.key, event.currentTarget);
            }
        };
    }

    /**
     * On click the ListViewItem
     */
    function onItemClick(v: ListViewItemData) {
        return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            if (event.ctrlKey && selectedState.length > 0) {
                // Select multiple items on Ctrl + Left Click
                if (selectedState.includes(v.key)) {
                    selectedState.splice(selectedState.indexOf(v.key), 1);
                    const list = [...selectedState];
                    setSelectedState(list);
                    props.onSelected(list);
                } else {
                    const list = [...selectedState, v.key];
                    setSelectedState(list);
                    props.onSelected(list);
                }
            } else if (event.shiftKey && selectedState.length > 0) {
                // Select continuous multiple items on Shift + Left Click
                let i = props.items.findIndex((v2) => selectedState.includes(v2.key));
                let vi = props.items.findIndex((v2) => v2.key === v.key);
                const list = [];
                if (vi < i) {
                    list.push(
                        ...props.items.slice(vi, i).map((v) => v.key),
                        ...selectedState
                    );
                } else if (vi > i) {
                    let j = Array.from(props.items)
                        .reverse()
                        .findIndex(
                            (v2) => selectedState.includes(v2.key) || v2.key === v.key
                        );
                    j = props.items.length - j - 1;
                    list.push(...props.items.slice(i, j + 1).map((v) => v.key));
                }
                setSelectedState(list);
                props.onSelected(list);
            } else {
                // Select single item on Left Click
                const list = [v.key];
                setSelectedState(list);
                props.onSelected(list);
            }
        };
    }
}
