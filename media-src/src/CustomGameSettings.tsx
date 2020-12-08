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
        description:
            'Sets a flag to enable/disable the default music handling code for custom games',
    },
    {
        func: 'SetCustomGameAllowHeroPickMusic',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: true,
        description:
            'Sets a flag to enable/disable the default music handling code for custom games',
    },
    {
        func: 'SetCustomGameAllowMusicAtGameStart',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: true,
        description:
            'Sets a flag to enable/disable the default music handling code for custom games',
    },
    {
        func: 'SetFirstBloodActive',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Control if the normal DOTA hero respawn rules apply.',
    },
    {
        func: 'SetHeroRespawnEnabled',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Control if the normal DOTA hero respawn rules apply.',
    },
    {
        func: 'SetHideKillMessageHeaders',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: false,
        description:
            'Sets whether the multikill, streak, and first-blood banners appear at the top of the screen.',
    },
    {
        func: 'SetSameHeroSelectionEnabled',
        namespace: GameRules,
        type: SettingValueType.Boolean,
        default: false,
        description: 'When true, players can repeatedly pick the same hero.',
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
        description:
            'When true, all items are available at as long as any shop is in range.',
    },
    {
        func: 'SetCustomGameEndDelay',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 180,
        description: 'Sets the game end delay.',
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
        description: 'Sets amount of penalty time before randoming a hero',
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
        // prettier-ignore
        description: 'Time in seconds for between the hero selection and entering the showcase phase.',
    },
    {
        func: 'SetShowcaseTime',
        namespace: GameRules,
        type: SettingValueType.Number,
        default: 0,
        description: 'Time in seconds for team showcase.',
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
        description: 'Time in seconds for spawn runes.',
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
    width: 400px;
    margin-right: 10px;
    margin-bottom: 10px;
`;

const SettingFunction = styled.div`
    display: flex;
    flex-direction: row;
`;

const SettingFunctionName = styled.div`
    color: var(--vscode-terminal-ansiCyan);
`;

const SettingDescription = styled.div`
    color: var(--vscode-descriptionForeground);
    font-size: 11px;
`;

const BooleanIcon = styled.div`
    font-size: 20px;
    padding-left: 10px;
    padding-right: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: var(--vscode-descriptionForeground);

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
            <SettingDescription>
                {props.api.description ? props.api.description : <span>&nbsp;</span>}
            </SettingDescription>
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
