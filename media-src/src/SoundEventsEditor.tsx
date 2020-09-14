import React from 'react';
import ReactDOM from 'react-dom';
import "./SoundEventsEditor.scss";

const i18n: {
    [key: string]: {
        'event': string;
        'type': string;
        'sounds': string;
        'volume': string;
        'pitch': string;
        'other_attr': string;
    }
} = {
    'en': {
        'event': 'Sound Event',
        'type': 'Sound Type',
        'sounds': 'vsnd_files',
        'volume': 'Volume',
        'pitch': 'Pitch',
        'other_attr': 'Other Attributes',
    },
    'zh-cn': {
        'event': '事件名',
        'type': '音效类型',
        'sounds': '音效文件(vsnd_files)',
        'volume': '音量',
        'pitch': '音高',
        'other_attr': '其它属性',
    },
};

const text = i18n[navigator.language] || i18n['en'];

function SoundEvent() {
    return (
        <tr>
            <td>
                <input type="text" placeholder="xxxx" defaultValue="xxxx" />
            </td>
            <td>
                <input type="text"/>
            </td>
            <td></td>
            <td>
                <input type="text" className="text-center"/>
            </td>
            <td>
                <input type="text" className="text-center"/>
            </td>
            <td></td>
        </tr>
    );
};

function SoundEventsEditor() {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>{text.event}</th>
                    <th>{text.type}</th>
                    <th>{text.sounds}</th>
                    <th className="short-head">{text.volume}</th>
                    <th className="short-head">{text.pitch}</th>
                    <th>{text.other_attr}</th>
                </tr>
            </thead>
            <tbody>
                <SoundEvent />
            </tbody>
        </table>
    );
}

const app = document.getElementById('app');
app?.classList.add('SoundEventsEditor');
ReactDOM.render(<SoundEventsEditor />, app);