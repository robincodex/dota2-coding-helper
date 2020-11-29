import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './SoundEventsEditor.scss';
import { editorCache, useWindowEvent } from './utils';
import * as Icons from 'react-bootstrap-icons';
import styled from '@emotion/styled';
import { ListView } from './Components/ListView';
import { CacheProvider } from '@emotion/react';
import { css } from '@emotion/css';
import { ContextMenuType, ShowContextMenu } from './Components/ContextMenu';
import commonText from './common_i18n';

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
    };
} = {
    en: {
        title: 'LIST OF SOUND EVENT NAME',
        event: 'Sound Event',
        type: 'Sound Type',
        sounds: 'vsnd_files',
        volume: 'Volume',
        pitch: 'Pitch',
        other_kv: 'Other KV',
        copy_event_name: 'Copy Sound Event Name',
    },
    'zh-cn': {
        title: '音效事件名列表',
        event: '事件名',
        type: '音效类型',
        sounds: '音效文件(vsnd_files)',
        volume: '音量',
        pitch: '音高',
        other_kv: '其它KV',
        copy_event_name: '复制音效名称',
    },
};

const localText = i18n[navigator.language] || i18n['en'];

type resultType = { [key: string]: string | string[] };

function SoundEvent({ soundData }: { soundData: resultType }) {
    return (
        <tr>
            <td>
                <input
                    type="text"
                    placeholder="xxxx"
                    defaultValue={(soundData['event'] as string).replace(/"/g, '')}
                />
            </td>
            <td>
                <input type="text" defaultValue={soundData['type']} />
            </td>
            <td>
                {Array.isArray(soundData['vsnd_files'])
                    ? soundData['vsnd_files'].map((v, i) => {
                          return (
                              <div key={i}>
                                  <Icons.CircleFill size={6} /> {v}
                              </div>
                          );
                      })
                    : null}
            </td>
            <td>
                <input
                    type="text"
                    className="text-center"
                    defaultValue={soundData['volume'] ?? 0}
                />
            </td>
            <td>
                <input
                    type="text"
                    className="text-center"
                    defaultValue={soundData['pitch'] ?? 0}
                />
            </td>
            <td></td>
        </tr>
    );
}

const EditorView = styled.div`
    position: fixed;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    gap: 5px;
    justify-content: stretch;
`;

const SoundContent = styled.div``;

function SoundEventsEditor() {
    let [soundEvents, setSoundEvents] = useState<resultType[]>([]);

    useWindowEvent('message', (evt) => {
        if (evt.data.label === 'update') {
            setSoundEvents(JSON.parse(evt.data.text));
        }
    });

    /**
     * Copy Sound Event Name
     */
    function copySoundNames(keys: number[]) {
        const events = keys.map((k) =>
            String(soundEvents[k]['event']).replace(/\"/g, '')
        );
        navigator.clipboard.writeText(events.join('\n'));
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
                                <div>{(v['event'] as string).replace(/\"/g, '')}</div>
                            ),
                        };
                    })}
                    onSelected={(items) => {}}
                    onKeyDown={(evt, methods) => {
                        if (evt.ctrlKey) {
                            if (evt.altKey) {
                                if (evt.key === 'c') {
                                    copySoundNames(
                                        methods.getSelectedItems().map(Number)
                                    );
                                }
                            }
                            if (evt.key === 'a') {
                                methods.selectAll();
                            }
                        }
                    }}
                    onContextMenu={(event, keys, methods) => {
                        const _keys = keys.map(Number);
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
                                    type: ContextMenuType.Separator,
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
                                    case 'select_all':
                                        methods.selectAll();
                                        break;
                                    case 'copy_event_name':
                                        copySoundNames(_keys);
                                        break;
                                }
                            },
                        });
                    }}
                />
                <SoundContent></SoundContent>
            </EditorView>
        </CacheProvider>
    );
}

const app = document.getElementById('app');
app?.classList.add('SoundEventsEditor');
ReactDOM.render(<SoundEventsEditor />, app);
