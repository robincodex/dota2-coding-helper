import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './SoundEventsEditor.scss';
import { editorCache, useWindowEvent } from './utils';
import * as Icons from 'react-bootstrap-icons';
import styled from '@emotion/styled';
import { ListView } from './Components/ListView';
import { CacheProvider } from '@emotion/react';
import { usePopper } from 'react-popper';

const i18n: {
    [key: string]: {
        title: string;
        event: string;
        type: string;
        sounds: string;
        volume: string;
        pitch: string;
        other_kv: string;
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
    },
    'zh-cn': {
        title: '音效事件名列表',
        event: '事件名',
        type: '音效类型',
        sounds: '音效文件(vsnd_files)',
        volume: '音量',
        pitch: '音高',
        other_kv: '其它KV',
    },
};

const text = i18n[navigator.language] || i18n['en'];

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

const SoundContent = styled.div`
    border: 1px solid #303030;
`;

function SoundEventsEditor() {
    let [soundEvents, setSoundEvents] = useState<resultType[]>([]);

    useWindowEvent('message', (evt) => {
        if (evt.data.label === 'update') {
            setSoundEvents(JSON.parse(evt.data.text));
        }
    });

    // return (
    //     <table className="table">
    //         <thead>
    //             <tr>
    //                 <th>{text.event}</th>
    //                 <th>{text.type}</th>
    //                 <th>{text.sounds}</th>
    //                 <th className="short-head">{text.volume}</th>
    //                 <th className="short-head">{text.pitch}</th>
    //                 <th>{text.other_kv}</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {soundEvents.map((v, i) => {
    //                 return <SoundEvent soundData={v} key={i} />;
    //             })}
    //         </tbody>
    //     </table>
    // );
    return (
        <CacheProvider value={editorCache}>
            <EditorView>
                <ListView
                    title={text.title}
                    items={soundEvents.map((v, i) => {
                        return {
                            key: i,
                            content: (
                                <div>{(v['event'] as string).replace(/\"/g, '')}</div>
                            ),
                        };
                    })}
                    onSelected={(items) => {
                        console.log(items);
                    }}
                    onContextMenu={(key, itemElement) => {}}
                />

                <SoundContent />
            </EditorView>
        </CacheProvider>
    );
}

const app = document.getElementById('app');
app?.classList.add('SoundEventsEditor');
ReactDOM.render(<SoundEventsEditor />, app);
