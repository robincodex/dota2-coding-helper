import { cx } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';
import { Toggle2Off, Toggle2On } from 'react-bootstrap-icons';
import ReactDOM from 'react-dom';
import { EditableText } from './Components/EditableText';
import { renderNumericState, TextInput } from './Components/TextInput';
import { editorCache, onRequestResponse, request, useWindowEvent } from './utils';
import type {
    GameAPI,
    GameAPIChangeEvent,
} from '../../src/editors/custom_game_settings';

let documentText = '';

enum SettingValueType {
    Boolean,
    String,
    Number,
}

type SettingType = {
    func: string;
    namespace: string;
    description?: string;
} & (
    | {
          type: SettingValueType.Boolean;
          default: boolean;
      }
    | {
          type: SettingValueType.Number;
          default: number;
          placeholder?: string;
      }
    | {
          type: SettingValueType.String;
          default: string;
          placeholder?: string;
      }
);

const GameRules = 'GameRules';
const GameMode = 'GameMode';

const SettingList: SettingType[] = [
    // GameRules
    {
        func: 'SetCustomGameAllowBattleMusic',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: true,
    },
    {
        func: 'SetCustomGameAllowHeroPickMusic',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: true,
    },
    {
        func: 'SetCustomGameAllowMusicAtGameStart',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: true,
    },
    {
        func: 'SetFirstBloodActive',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Is first blood active?',
    },
    {
        func: 'SetHeroRespawnEnabled',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Do heroes automatically respawn?',
    },
    {
        func: 'SetHideKillMessageHeaders',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: false,
    },
    {
        func: 'SetSameHeroSelectionEnabled',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: false,
    },
    {
        func: 'SetUseBaseGoldBountyOnHeroes',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Force base gold usage instead of calculated value.',
    },
    {
        func: 'SetUseUniversalShopMode',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: false,
    },
    {
        func: 'SetCustomGameEndDelay',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 180,
    },
    {
        func: 'SetGoldPerTick',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 1,
        description: 'Gold to award to all players each gold tick.',
    },
    {
        func: 'SetGoldTickTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 0.6,
        description: 'Time in seconds between gold ticks.',
    },
    {
        func: 'SetStartingGold',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 625,
        description: 'Gold players start with.',
    },
    {
        func: 'SetHeroMinimapIconScale',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 1,
        description: 'Scale for hero minimap icons.',
    },
    {
        func: 'SetCreepMinimapIconScale',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 1,
        description: 'Scale for creep minimap icons.',
    },
    {
        func: 'SetRuneMinimapIconScale',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 1,
        description: 'Scale for rune minimap icons.',
    },
    {
        func: 'SetHeroSelectPenaltyTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 0,
    },
    {
        func: 'SetHeroSelectionTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 60,
        description: 'Time in seconds for hero selection.',
    },
    {
        func: 'SetStrategyTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 0,
    },
    {
        func: 'SetShowcaseTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 0,
    },
    {
        func: 'SetPreGameTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 90,
        description: 'Time in seconds before the game begins.',
    },
    {
        func: 'SetPostGameTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 60,
        description: 'Time in seconds after the game ends before the server.',
    },
    {
        func: 'SetRuneSpawnTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 120,
    },
    {
        func: 'SetTimeOfDay',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 0,
        description: 'Current time of day.',
    },
    {
        func: 'SetTreeRegrowTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 300,
        description: 'Time in seconds for a tree to regrow.',
    },
];

const SettingContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px;
    min-width: 400px;
`;

const SettingFunction = styled.div`
    display: flex;
    flex-direction: row;
`;

const SettingFunctionName = styled.div`
    color: var(--vscode-terminal-ansiCyan);
`;

const BooleanIcon = styled.div`
    font-size: 20px;
    padding-left: 10px;
    padding-right: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: var(--vscode-panel-border);

    &.is-true {
        color: var(--vscode-terminal-ansiGreen);
    }
`;

type SettingProps = { api: SettingType; value: GameAPI | undefined };

function SettingValueBoolean(props: SettingProps) {
    if (props.api.type !== SettingValueType.Boolean) {
        return null;
    }
    let v = props.api.default;
    if (props.value) {
        v = props.value.Params[0].toString() === 'true';
    }
    return (
        <BooleanIcon
            className={cx({ 'is-true': v })}
            onClick={() => {
                request('change-boolean', {
                    Namespace: props.api.namespace,
                    FuncName: props.api.func,
                    value: !v,
                } as GameAPIChangeEvent<boolean>);
            }}
        >
            {v ? <Toggle2On /> : <Toggle2Off />}
        </BooleanIcon>
    );
}

function SettingValueNumber(props: SettingProps) {
    if (props.api.type !== SettingValueType.Number) {
        return null;
    }
    let v = props.api.default;
    if (props.value) {
        v = parseInt(props.value.Params[0]);
    }
    return (
        <EditableText
            style={{ width: 50, textAlign: 'center', borderRadius: 10000 }}
            renderState={renderNumericState}
            defaultValue={v.toString()}
            onComplete={(text) => {
                request('change-number', {
                    Namespace: props.api.namespace,
                    FuncName: props.api.func,
                    value: parseInt(text) || 0,
                } as GameAPIChangeEvent<number>);
            }}
        />
    );
}

function Setting(props: SettingProps) {
    return (
        <SettingContainer>
            <SettingFunction>
                <SettingFunctionName>{props.api.func}</SettingFunctionName>&nbsp;
                {'( '}
                <SettingValueBoolean api={props.api} value={props.value} />
                <SettingValueNumber api={props.api} value={props.value} />
                {' )'}
            </SettingFunction>
        </SettingContainer>
    );
}

const SettingsRoot = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

function CustomGameSettings() {
    const [apiList, setAPIList] = useState<GameAPI[]>([]);

    useWindowEvent('message', (evt) => {
        if (evt.data.label === 'update') {
            setAPIList(JSON.parse(evt.data.text));
        } else {
            onRequestResponse(evt.data);
        }
    });

    return (
        <CacheProvider value={editorCache}>
            <SettingsRoot>
                {SettingList.map((v, i) => {
                    const value = apiList.find(
                        (v2) => v2.Namespace === v.namespace && v2.FuncName === v.func
                    );
                    return <Setting api={v} value={value} key={i} />;
                })}
            </SettingsRoot>
        </CacheProvider>
    );
}

const app = document.getElementById('app');
ReactDOM.render(<CustomGameSettings />, app);
