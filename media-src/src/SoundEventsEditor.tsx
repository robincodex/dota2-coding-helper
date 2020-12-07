import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './SoundEventsEditor.scss';
import { editorCache, onRequestResponse, request, useWindowEvent } from './utils';
import * as Icons from 'react-bootstrap-icons';
import styled from '@emotion/styled';
import { ListView, ListViewMethods } from './Components/ListView';
import { CacheProvider } from '@emotion/react';
import { css } from '@emotion/css';
import { ContextMenuType, ShowContextMenu } from './Components/ContextMenu';
import commonText from './common_i18n';
import { EditableText } from './Components/EditableText';
import { CellInput } from './Components/CellInput';
import { renderPositiveNumericState, TextInput } from './Components/TextInput';
import type { ISoundEventData } from '../../src/editors/sound_events_editor';
import { InputState } from './Components/utils';
import {
    ShowInputDialog,
    ShowModalDialog,
    ShowTextareaDialog,
} from './Components/ModalDialog';
import { Button, ButtonGroup } from './Components/Button';

const i18n: {
    [key: string]: {
        title: string;
        event: string;
        type: string;
        sounds: string;
        volume: string;
        pitch: string;
        other_kv: string;
        copy_event_name: string;
        add_sound_file_title: string;
        add_sound_file_tip: string;
        add_sound_event: string;
        duplicate_sound_events: string;
    };
} = {
    en: {
        title: 'LIST OF SOUND EVENT NAME',
        event: 'Sound Event',
        type: 'Sound Type',
        sounds: 'Sound Files (*.vsnd)',
        volume: 'Volume',
        pitch: 'Pitch',
        other_kv: 'Other KV',
        copy_event_name: 'Copy Sound Event Name',
        add_sound_file_title: 'Add Sound Files',
        add_sound_file_tip: 'One sound file path per line. Each line ends with .vsnd',
        add_sound_event: 'New Sound Event Name',
        duplicate_sound_events: 'Dulpicate',
    },
    'zh-cn': {
        title: '音效事件名列表',
        event: '事件名',
        type: '音效类型',
        sounds: '音效文件 (*.vsnd)',
        volume: '音量',
        pitch: '音高',
        other_kv: '其它KV',
        copy_event_name: '复制音效名称',
        add_sound_file_title: '添加音效文件',
        add_sound_file_tip: '每行一条音效文件路径，每行以.vsnd结尾',
        add_sound_event: '新建音效事件',
        duplicate_sound_events: '创建副本',
    },
};

const localText = i18n[document.documentElement.lang.toLowerCase()] || i18n['en'];

const keysSuggestion: { [key: string]: string[] } = {
    type: [
        'dota_update_default',
        'dota_limit_speakers_ui',
        'dota_src1_2d',
        'dota_src1_3d',
        'dota_src1_3d_footsteps',
        'dota_gamestart_horn',
        'dota_null_start',
        'dota_music_respawn',
        'dota_update_hero_select',
        'dota_update_killed',
        'dota_music_mainloop',
        'dota_statebattlemusic',
        'dota_battle',
        'dota_battleend',
        'dota_battlepicker',
        'dota_music_death_request',
        'dota_update_vo_switch',
    ],
    mixgroup: ['Weapons'],
};

function SoundEvent({
    soundData,
    index,
}: {
    index: number;
    soundData: ISoundEventData;
}) {
    // Delte Sound Files
    function deleteSoundFiles(indexes: number[]) {
        request('remove-sound-files', index, indexes);
    }
    // Add a sound file
    function addSoundFile(indexes: number[]) {
        ShowTextareaDialog({
            title: localText.add_sound_file_title,
            label: localText.add_sound_file_tip,
            width: 600,
            height: 100,
            ok: (text) => {
                const list = text.split('\n').map((v) => v.trim());
                request('add-sound-files', index, indexes.sort().pop(), list);
            },
            renderValue(text) {
                return text.replace(/\"/g, '');
            },
            renderState(text) {
                const list = text.split('\n');
                if (!list.every((v) => v.trim().endsWith('.vsnd'))) {
                    return InputState.Error;
                }
                return InputState.Normal;
            },
        });
    }
    // Copy Sound Files
    function copySoundFiles(indexes: number[]) {
        request('copy-sound-files', index, indexes);
    }
    // Paste Sound Files
    function pasteSoundFiles(indexes: number[]) {
        request('paste-sound-files', index, indexes);
    }

    return (
        <SoundCard>
            <div style={{ marginBottom: 0 }}>
                <EditableText
                    defaultValue={soundData['event']}
                    renderValue={(text) => text.replace(/\"/g, '')}
                    style={{
                        fontSize: 25,
                        borderBottom: '1px solid var(--vscode-panel-border)',
                    }}
                    onComplete={(text) => {
                        request('change-event-name', index, text);
                    }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <TextInput
                    label={localText.type}
                    labelStyle={{ color: 'var(--vscode-terminal-ansiBrightMagenta)' }}
                    searchTexts={keysSuggestion['type']}
                    defaultValue={soundData.type}
                    onComplete={(text) => {
                        request('change-sound-key', index, 'type', text);
                    }}
                />
                <TextInput
                    renderState={renderPositiveNumericState}
                    label={localText.volume}
                    labelStyle={{ color: 'var(--vscode-terminal-ansiBrightMagenta)' }}
                    defaultValue={soundData.volume}
                    onComplete={(text) => {
                        request('change-sound-key', index, 'volume', text);
                    }}
                />
                <TextInput
                    renderState={renderPositiveNumericState}
                    label={localText.pitch}
                    labelStyle={{ color: 'var(--vscode-terminal-ansiBrightMagenta)' }}
                    defaultValue={soundData.pitch}
                    onComplete={(text) => {
                        request('change-sound-key', index, 'pitch', text);
                    }}
                />
            </div>
            <div>
                <ListView
                    title={localText.sounds}
                    titleStyle={{ color: 'var(--vscode-terminal-ansiBrightMagenta)' }}
                    smallTitle
                    items={soundData.vsnd_files.map((v, i) => {
                        return {
                            key: i,
                            content: (
                                <CellInput
                                    defaultValue={v}
                                    stopKeyDownPropagation={true}
                                    renderState={(v) => {
                                        if (!v.endsWith('.vsnd')) {
                                            return InputState.Error;
                                        }
                                        return InputState.Normal;
                                    }}
                                    onComplete={(text) => {
                                        request('change-sound-file', index, i, text);
                                    }}
                                />
                            ),
                        };
                    })}
                    onKeyDown={(evt, keys, methods) => {
                        if (evt.ctrlKey) {
                            if (evt.key === 'a') {
                                methods.selectAll();
                            } else if (evt.key === 'c') {
                                copySoundFiles(keys);
                            } else if (evt.key === 'v') {
                                pasteSoundFiles(keys);
                            }
                        }
                        if (evt.key === 'Delete') {
                            deleteSoundFiles(keys);
                        }
                    }}
                    onContextMenu={async (evt, keys, methods) => {
                        ShowContextMenu({
                            menu: [
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'copy',
                                    text: commonText.copy,
                                    hotkey: 'Ctrl+C',
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'paste',
                                    text: commonText.paste,
                                    inactive: false,
                                    hotkey: 'Ctrl+V',
                                },
                                {
                                    type: ContextMenuType.Separator,
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'add',
                                    text: commonText.add,
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'select_all',
                                    text: commonText.select_all,
                                    hotkey: 'Ctrl+A',
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'delete',
                                    text: commonText.delete,
                                    hotkey: 'Del',
                                },
                            ],
                            offset: { top: evt.clientY, left: evt.clientX },
                            onClick(id) {
                                switch (id) {
                                    case 'select_all':
                                        methods.selectAll();
                                        break;
                                    case 'delete':
                                        deleteSoundFiles(keys);
                                        break;
                                    case 'add':
                                        addSoundFile(keys);
                                        break;
                                    case 'copy':
                                        copySoundFiles(keys);
                                        break;
                                    case 'paste':
                                        pasteSoundFiles(keys);
                                        break;
                                }
                            },
                        });
                    }}
                    onMoveItems={async (keys, target, isTop, methods) => {
                        const result = await request<{
                            startIndex: number;
                            length: number;
                        }>('move-sound-files', index, keys, target, isTop);
                        if (result) {
                            let list: number[] = [];
                            for (let i = 0; i < result.length; i++) {
                                list.push(result.startIndex + i);
                            }
                            methods.select(list);
                        }
                    }}
                />
            </div>
        </SoundCard>
    );
}

const EditorView = styled.div`
    position: fixed;
    top: var(--base-gap);
    left: var(--base-gap);
    right: var(--base-gap);
    bottom: var(--base-gap);
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    gap: var(--base-gap);
    justify-content: stretch;
`;

const SoundsList = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

const SoundCard = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid var(--vscode-panel-border);
    flex-shrink: 0;
    user-select: none;
    border-radius: var(--panel-border-radius);
    /* background: var(--vscode-editorWidget-background); */
    padding: 20px;
    margin-bottom: var(--base-gap);
`;

function SoundEventsEditor() {
    let [soundEvents, setSoundEvents] = useState<ISoundEventData[]>([]);
    let [editableItems, setEditableItems] = useState<number[]>([]);

    useWindowEvent('message', (evt) => {
        if (evt.data.label === 'update') {
            setSoundEvents(JSON.parse(evt.data.text));
        } else {
            onRequestResponse(evt.data);
        }
    });

    // Copy Sound Event Name
    function copySoundNames(keys: number[]) {
        const events = keys.map((k) =>
            String(soundEvents[k]['event']).replace(/\"/g, '')
        );
        navigator.clipboard.writeText(events.join('\n'));
    }

    // Copy Sound Events
    function copySoundEvents(indexes: number[]) {
        request('copy-sound-events', indexes);
    }
    // Paste Sound Events
    async function pasteSoundEvents(
        indexes: number[],
        methods: ListViewMethods<number>
    ) {
        const list = await request<number[]>(
            'paste-sound-events',
            indexes.sort().pop()
        );
        methods.select(list);
    }
    // Delte Sound Events
    function deleteSoundEvents(indexes: number[]) {
        request('remove-events', indexes);
    }
    // Add a sound event
    function addSoundEvent(indexes: number[]) {
        ShowInputDialog({
            title: localText.add_sound_event,
            ok: (text) => {
                request('add-event', indexes.sort().pop(), text);
            },
            renderValue(text) {
                return text.trim().replace(/\"/g, '');
            },
        });
    }

    return (
        <CacheProvider value={editorCache}>
            <EditorView>
                <ListView
                    title={localText.title}
                    items={soundEvents.map((v, i) => {
                        return {
                            key: i,
                            content: (
                                <div style={{ padding: 5 }}>
                                    {v.event.replace(/\"/g, '')}
                                </div>
                            ),
                        };
                    })}
                    onSelected={(keys) => {
                        setEditableItems(keys);
                    }}
                    onKeyDown={(evt, keys, methods) => {
                        if (evt.ctrlKey) {
                            if (evt.altKey) {
                                if (evt.key === 'c') {
                                    copySoundNames(keys);
                                }
                            } else if (evt.key === 'a') {
                                methods.selectAll();
                            } else if (evt.key === 'c') {
                                copySoundEvents(keys);
                            } else if (evt.key === 'v') {
                                pasteSoundEvents(keys, methods);
                            }
                        }
                        if (evt.key === 'Delete') {
                            deleteSoundEvents(keys);
                        }
                    }}
                    onContextMenu={async (event, keys, methods) => {
                        const canPaste = await request<boolean>(
                            'can-paste-sound-events'
                        );
                        ShowContextMenu({
                            menu: [
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'copy',
                                    text: commonText.copy,
                                    hotkey: 'Ctrl+C',
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'copy_event_name',
                                    text: localText.copy_event_name,
                                    hotkey: 'Ctrl+Alt+C',
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'paste',
                                    text: commonText.paste,
                                    hotkey: 'Ctrl+V',
                                    inactive: !canPaste,
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'duplicate',
                                    text: localText.duplicate_sound_events,
                                },
                                {
                                    type: ContextMenuType.Separator,
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'add',
                                    text: commonText.add,
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'select_all',
                                    text: commonText.select_all,
                                    hotkey: 'Ctrl+A',
                                },
                                {
                                    type: ContextMenuType.Normal,
                                    id: 'delete',
                                    text: commonText.delete,
                                    hotkey: 'Del',
                                },
                            ],
                            offset: {
                                top: event.clientY,
                                left: event.clientX,
                            },
                            onClick: (id) => {
                                switch (id) {
                                    case 'copy':
                                        copySoundEvents(keys);
                                        break;
                                    case 'paste':
                                        pasteSoundEvents(keys, methods);
                                        break;
                                    case 'select_all':
                                        methods.selectAll();
                                        break;
                                    case 'copy_event_name':
                                        copySoundNames(keys);
                                        break;
                                    case 'delete':
                                        deleteSoundEvents(keys);
                                        break;
                                    case 'add':
                                        addSoundEvent(keys);
                                        break;
                                    case 'duplicate':
                                        request('duplicate-sound-events', keys);
                                        break;
                                }
                            },
                        });
                    }}
                    onMoveItems={async (keys, target, isTop, methods) => {
                        const result = await request<{
                            startIndex: number;
                            length: number;
                        }>('move-sound-events', keys, target, isTop);
                        if (result) {
                            let list: number[] = [];
                            for (let i = 0; i < result.length; i++) {
                                list.push(result.startIndex + i);
                            }
                            methods.select(list);
                        }
                    }}
                />
                <SoundsList>
                    {editableItems.map((i) => {
                        if (!soundEvents[i]) {
                            return null;
                        }
                        return (
                            <SoundEvent key={i} index={i} soundData={soundEvents[i]} />
                        );
                    })}
                </SoundsList>
            </EditorView>
        </CacheProvider>
    );
}

const app = document.getElementById('app');
ReactDOM.render(<SoundEventsEditor />, app);
