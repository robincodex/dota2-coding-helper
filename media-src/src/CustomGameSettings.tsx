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
        description: 'Sets whether First Blood has been triggered.',
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
        func: 'SetAlwaysShowPlayerInventory',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description:
            "Show the player hero's inventory in the HUD, regardless of what unit is selected.",
    },
    {
        func: 'SetAlwaysShowPlayerNames',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description:
            'Set whether player names are always shown, regardless of client setting.',
    },
    {
        func: 'SetAnnouncerDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Mutes the in-game announcer.',
    },
    {
        func: 'SetBuybackEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Enables or disables buyback completely.',
    },
    {
        func: 'SetCustomBuybackCooldownEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Turns on capability to define custom buyback cooldowns.',
    },
    {
        func: 'SetCustomBuybackCostEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Turns on capability to define custom buyback costs.',
    },
    {
        func: 'SetDaynightCycleDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Enable or disable the day/night cycle.',
    },
    {
        func: 'SetDeathOverlayDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description:
            'Specify whether the full screen death overlay effect plays when the selected hero dies.',
    },
    {
        func: 'SetFogOfWarDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Turn the fog of war on or off.',
    },
    {
        func: 'SetForceRightClickAttackDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Prevent users from using the right click deny setting.',
    },
    {
        func: 'SetFreeCourierModeEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description: 'If set to true, enable 7.23 free courier mode.',
    },
    {
        func: 'SetFriendlyBuildingMoveToEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Allows clicks on friendly buildings to be handled normally.',
    },
    {
        func: 'SetGoldSoundDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Turn the sound when gold is acquired off/on.',
    },
    {
        func: 'SetHudCombatEventsDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Specify whether the default combat events will show in the HUD.',
    },
    {
        func: 'SetKillableTombstones',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description:
            'Set whether tombstones can be channeled to be removed by enemy heroes.',
    },
    {
        func: 'SetKillingSpreeAnnouncerDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Mutes the in-game killing spree announcer.',
    },
    {
        func: 'SetLoseGoldOnDeath',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Use to disable gold loss on death.',
    },
    {
        func: 'SetNeutralItemHideUndiscoveredEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description:
            'When enabled, undiscovered items in the neutral item stash are hidden.',
    },
    {
        func: 'SetNeutralStashEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Allow items to be sent to the neutral stash.',
    },
    {
        func: 'SetNeutralStashTeamViewOnlyEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description: 'When enabled, the all neutral items tab cannot be viewed.',
    },
    {
        func: 'SetPauseEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Set pausing enabled/disabled',
    },
    {
        func: 'SetRandomHeroBonusItemGrantDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Disables bonus items for randoming a hero.',
    },
    {
        func: 'SetRecommendedItemsDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Turn the panel for showing recommended items at the shop off/on.',
    },
    {
        func: 'SetRemoveIllusionsOnDeath',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description:
            'Make it so illusions are immediately removed upon death, rather than sticking around for a few seconds.',
    },
    {
        func: 'SetSelectionGoldPenaltyEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Enable/disable gold penalty for late picking.',
    },
    {
        func: 'SetSendToStashEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Allow items to be sent to the stash.',
    },
    {
        func: 'SetStashPurchasingDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description:
            'Turn purchasing items to the stash off/on. If purchasing to the stash is off the player must be at a shop to purchase items.',
    },
    {
        func: 'SetStickyItemDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Hide the sticky item in the quickbuy.',
    },
    {
        func: 'SetTowerBackdoorProtectionEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description: 'Enables/Disables tower backdoor protection.',
    },
    {
        func: 'SetUnseenFogOfWarEnabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description:
            'Enable or disable unseen fog of war. When enabled parts of the map the player has never seen will be completely hidden by fog of war.',
    },
    {
        func: 'SetUseDefaultDOTARuneSpawnLogic',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: true,
        description:
            'If set to true, use current rune spawn rules. Either setting respects custom spawn intervals.',
    },
    {
        func: 'SetWeatherEffectsDisabled',
        namespace: GameMode,
        type: SettingValueType.Boolean,
        default: false,
        description: 'Set if weather effects are disabled.',
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
    {
        func: 'SetBountyRuneSpawnInterval',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 60,
        description: 'Set bounty rune spawn rate',
    },
    {
        func: 'SetCameraDistanceOverride',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 1134,
        description: 'Set a different camera distance; dota default is 1134.',
    },
    {
        func: 'SetCameraSmoothCountOverride',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 8,
        description: 'Set a different camera smooth count; dota default is 8.',
    },
    {
        func: 'SetCameraZRange',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 0,
        description: 'Sets the camera Z range',
    },
    {
        func: 'SetCustomBackpackCooldownPercent',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 0,
        description: 'Set the rate cooldown ticks down for items in the backpack.',
    },
    {
        func: 'SetCustomBackpackSwapCooldown',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 0,
        description: 'Set a custom cooldown for swapping items into the backpack.',
    },
    {
        func: 'SetCustomGlyphCooldown',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 0,
        description: 'Set a custom cooldown for team Glyph ability.',
    },
    {
        func: 'SetCustomScanCooldown',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 0,
        description: 'Set a custom cooldown for team Scan ability.',
    },
    {
        func: 'SetDraftingBanningTimeOverride',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 30,
        description: 'Set drafting hero banning time',
    },
    {
        func: 'SetDraftingHeroPickSelectTimeOverride',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 30,
        description: 'Set drafting hero pick time',
    },
    {
        func: 'SetFixedRespawnTime',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 0,
        description: 'Set a fixed delay for all players to respawn after.',
    },
    {
        func: 'SetFountainConstantManaRegen',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: -1,
        description:
            'Set the constant rate that the fountain will regen mana. (-1 for default)',
    },
    {
        func: 'SetFountainPercentageHealthRegen',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: -1,
        description:
            'Set the percentage rate that the fountain will regen health. (-1 for default)',
    },
    {
        func: 'SetFountainPercentageManaRegen',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: -1,
        description:
            'Set the percentage rate that the fountain will regen mana. (-1 for default)',
    },
    {
        func: 'SetMaximumAttackSpeed',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 1000,
        description: 'Set the maximum attack speed for units.',
    },
    {
        func: 'SetMinimumAttackSpeed',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 0,
        description: 'Set the minimum attack speed for units.',
    },
    {
        func: 'SetPowerRuneSpawnInterval',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 120,
        description: 'Set power rune spawn rate',
    },
    {
        func: 'SetRespawnTimeScale',
        namespace: GameMode,
        type: SettingValueType.Number,
        default: 1,
        description:
            'Sets the scale applied to non-fixed respawn times. 1 = default DOTA respawn calculations.',
    },
];

const SetCustomGameTeamMaxPlayers = {
    description: 'Set whether a team is selectable during game setup.',
    teams: [
        { enum: 'DOTA_TEAM_GOODGUYS', default: 5 },
        { enum: 'DOTA_TEAM_BADGUYS', default: 5 },
        { enum: 'DOTA_TEAM_NEUTRALS', default: 0 },
        { enum: 'DOTA_TEAM_CUSTOM_1', default: 0 },
        { enum: 'DOTA_TEAM_CUSTOM_2', default: 0 },
        { enum: 'DOTA_TEAM_CUSTOM_3', default: 0 },
        { enum: 'DOTA_TEAM_CUSTOM_4', default: 0 },
        { enum: 'DOTA_TEAM_CUSTOM_5', default: 0 },
        { enum: 'DOTA_TEAM_CUSTOM_6', default: 0 },
        { enum: 'DOTA_TEAM_CUSTOM_7', default: 0 },
        { enum: 'DOTA_TEAM_CUSTOM_8', default: 0 },
    ],
};

const DescriptionLocalize: Record<string, { 'zh-cn': string }> = {
    'Sets a flag to enable/disable the default music handling code for custom games': {
        'zh-cn': '禁用该类型的音乐',
    },
    'Sets whether First Blood has been triggered.': {
        'zh-cn': '设置是否触发第一滴血效果',
    },
    'Control if the normal DOTA hero respawn rules apply.': {
        'zh-cn': '设置英雄是否可以重生',
    },
    'Sets whether the multikill, streak, and first-blood banners appear at the top of the screen.': {
        'zh-cn': '设置是否在触发第一滴血，多杀，连续击杀的时候在界面顶部显示消息',
    },
    'When true, players can repeatedly pick the same hero.': {
        'zh-cn': '设置是否可以选择相同英雄',
    },
    'Force base gold usage instead of calculated value.': {
        'zh-cn': '击杀英雄强制为固定的金币奖励，而不是计算后的奖励',
    },
    'When true, all items are available at as long as any shop is in range.': {
        'zh-cn': '设置true，商店的触发范围将没有距离限制',
    },
    "Show the player hero's inventory in the HUD, regardless of what unit is selected.": {
        'zh-cn': '在HUD中显示玩家英雄的物品栏，不管选择了什么单位',
    },
    'Set whether player names are always shown, regardless of client setting.': {
        'zh-cn': '设置是否始终显示玩家名称，而不考虑客户端设置',
    },
    'Mutes the in-game announcer.': {
        'zh-cn': '禁用游戏内的播音员',
    },
    'Enables or disables buyback completely.': {
        'zh-cn': '启用或者禁用买活',
    },
    'Turns on capability to define custom buyback cooldowns.': {
        'zh-cn': '自定义买活CD',
    },
    'Turns on capability to define custom buyback costs.': {
        'zh-cn': '自定义买活需要消耗的金币',
    },
    'Enable or disable the day/night cycle.': {
        'zh-cn': '启用或者禁用日夜交替',
    },
    'Specify whether the full screen death overlay effect plays when the selected hero dies.': {
        'zh-cn': '玩家选择的英雄死亡时是否播放全屏死亡覆盖效果',
    },
    'Turn the fog of war on or off.': {
        'zh-cn': '设置是否禁用战争迷雾',
    },
    'Prevent users from using the right click deny setting.': {
        'zh-cn': '阻止使用右键攻击的事件',
    },
    'If set to true, enable 7.23 free courier mode.': {
        'zh-cn': '如果设置为true，启用7.23版本的信使模式',
    },
    'Allows clicks on friendly buildings to be handled normally.': {
        'zh-cn': '允许点击友方的建筑',
    },
    'Turn the sound when gold is acquired off/on.': {
        'zh-cn': '禁用获得的金币音效',
    },
    'Specify whether the default combat events will show in the HUD.': {
        'zh-cn': '默认战斗事件是否将在HUD中显示',
    },
    'Set whether tombstones can be channeled to be removed by enemy heroes.': {
        'zh-cn': '设置墓碑是否被敌方英雄攻击',
    },
    'Mutes the in-game killing spree announcer.': {
        'zh-cn': '禁用游戏中击杀类的播音员',
    },
    'Use to disable gold loss on death.': {
        'zh-cn': '禁用死亡后损失金币',
    },
    'When enabled, undiscovered items in the neutral item stash are hidden.': {
        'zh-cn': '启用后，未被发现的中立物品将被隐藏',
    },
    'Allow items to be sent to the neutral stash.': {
        'zh-cn': '允许物品放到中立储藏处',
    },
    'When enabled, the all neutral items tab cannot be viewed.': {
        'zh-cn': '启用后，将无法查看所有中立物品标签',
    },
    'Set pausing enabled/disabled': {
        'zh-cn': '启用或关闭游戏暂停',
    },
    'Disables bonus items for randoming a hero.': {
        'zh-cn': '禁用随机分配英雄的奖励物品',
    },
    'Turn the panel for showing recommended items at the shop off/on.': {
        'zh-cn': '禁用推荐出装',
    },
    'Make it so illusions are immediately removed upon death, rather than sticking around for a few seconds.': {
        'zh-cn': '启用后幻象死亡将立即移除，而不是等待几秒后移除',
    },
    'Enable/disable gold penalty for late picking.': {
        'zh-cn': '启用或关闭随机英雄的金币惩罚',
    },
    'Allow items to be sent to the stash.': {
        'zh-cn': '允许将物品放到储藏处',
    },
    'Turn purchasing items to the stash off/on. If purchasing to the stash is off the player must be at a shop to purchase items.': {
        'zh-cn': '开启/关闭购买物品的储藏处, 如果关闭了购买，玩家必须在商店购买物品',
    },
    'Hide the sticky item in the quickbuy.': {
        'zh-cn': '在快速购买中隐藏合成配方物品',
    },
    'Enables/Disables tower backdoor protection.': {
        'zh-cn': '启用/禁用建筑的保护',
    },
    'Enable or disable unseen fog of war. When enabled parts of the map the player has never seen will be completely hidden by fog of war.': {
        'zh-cn': '启用或禁用黑色迷雾，玩家未探索的区域将是完全黑色的',
    },
    'If set to true, use current rune spawn rules. Either setting respects custom spawn intervals.': {
        'zh-cn': '如果设置未true，使用DOTA2默认刷新神符的逻辑',
    },
    'Set if weather effects are disabled.': {
        'zh-cn': '禁用天气效果',
    },
    'Sets the game end delay.': {
        'zh-cn': '游戏结束延迟',
    },
    'Gold to award to all players each gold tick.': {
        'zh-cn': '自动获得的金币',
    },
    'Time in seconds between gold ticks.': {
        'zh-cn': '自动获得的金币的间隔',
    },
    'Gold players start with.': {
        'zh-cn': '起始金币',
    },
    'Scale for hero minimap icons.': {
        'zh-cn': '英雄图标在小地图的大小',
    },
    'Scale for creep minimap icons.': {
        'zh-cn': '野怪图标在小地图的大小',
    },
    'Scale for rune minimap icons.': {
        'zh-cn': '神符图标在小地图的大小',
    },
    'Sets amount of penalty time before randoming a hero': {
        'zh-cn': '随机英雄的金币惩罚',
    },
    'Time in seconds for hero selection.': {
        'zh-cn': '选择英雄阶段的时间（秒）',
    },
    'Time in seconds for between the hero selection and entering the showcase phase.': {
        'zh-cn': '决策阶段的时间（秒）',
    },
    'Time in seconds for team showcase.': {
        'zh-cn': '展示阶段的时间（秒）',
    },
    'Time in seconds before the game begins.': {
        'zh-cn': '预备阶段的时间（秒）',
    },
    'Time in seconds after the game ends before the server.': {
        'zh-cn': '游戏结束阶段的时间（秒）',
    },
    'Time in seconds for spawn runes.': {
        'zh-cn': '刷新神符的时间（秒）',
    },
    'Current time of day.': {
        'zh-cn': '白天时间',
    },
    'Time in seconds for a tree to regrow.': {
        'zh-cn': '树木重生的时间（秒）',
    },
    'Set bounty rune spawn rate': {
        'zh-cn': '赏金神符的刷新间隔',
    },
    'Set a different camera distance; dota default is 1134.': {
        'zh-cn': '镜头距离，默认1134',
    },
    'Set a different camera smooth count; dota default is 8.': {
        'zh-cn': '镜头的平滑数量，默认为8',
    },
    'Sets the camera Z range': {
        'zh-cn': '镜头的Z轴范围',
    },
    'Set the rate cooldown ticks down for items in the backpack.': {
        'zh-cn': '自定义背包中的物品CD的百分比',
    },
    'Set a custom cooldown for swapping items into the backpack.': {
        'zh-cn': '自定义与背包切换物品的CD',
    },
    'Set a custom cooldown for team Glyph ability.': {
        'zh-cn': '防御符文的CD',
    },
    'Set a custom cooldown for team Scan ability.': {
        'zh-cn': '扫描的CD',
    },
    'Set drafting hero banning time': {
        'zh-cn': 'Ban英雄的时间',
    },
    'Set drafting hero pick time': {
        'zh-cn': '选择英雄的时间',
    },
    'Set a fixed delay for all players to respawn after.': {
        'zh-cn': '固定英雄的复活时间（秒）',
    },
    'Set the constant rate that the fountain will regen mana. (-1 for default)': {
        'zh-cn': '泉水的魔法值恢复速度',
    },
    'Set the percentage rate that the fountain will regen health. (-1 for default)': {
        'zh-cn': '泉水的生命值恢复速度',
    },
    'Set the percentage rate that the fountain will regen mana. (-1 for default)': {
        'zh-cn': '泉水的魔法值百分比恢复速度',
    },
    'Set the maximum attack speed for units.': {
        'zh-cn': '最大攻击速度',
    },
    'Set the minimum attack speed for units.': {
        'zh-cn': '最小攻击速度',
    },
    'Set power rune spawn rate': {
        'zh-cn': '刷新神符的间隔',
    },
    'Sets the scale applied to non-fixed respawn times. 1 = default DOTA respawn calculations.': {
        'zh-cn': '设置重生时间的相对大小，设置为1，默认为DOTA2使用的重生时间计算方式',
    },
    'Set whether a team is selectable during game setup.': {
        'zh-cn': '设置队伍人数',
    },
};

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

const lang = document.documentElement.lang.toLowerCase() as keyof typeof DescriptionLocalize[string];

function getLocalize(text: string) {
    const data = DescriptionLocalize[text];
    if (!data) {
        return text;
    }
    if (data[lang]) {
        return data[lang];
    }
    return text;
}

function Setting(props: SettingProps) {
    return (
        <SettingContainer>
            <SettingFunction>
                <SettingFunctionName>{props.api.func}</SettingFunctionName>&nbsp;
                {'('}
                <SettingValueBoolean api={props.api} value={props.value} />
                <SettingValueNumber api={props.api} value={props.value} />
                {')'}
            </SettingFunction>
            <SettingDescription>
                {props.api.description ? (
                    getLocalize(props.api.description)
                ) : (
                    <span>&nbsp;</span>
                )}
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
                {/* SetCustomGameTeamMaxPlayers */}
                <div>
                    <SettingContainer>
                        <SettingFunction>
                            <SettingFunctionName>
                                SetCustomGameTeamMaxPlayers
                            </SettingFunctionName>
                        </SettingFunction>
                        <SettingDescription>
                            {getLocalize(SetCustomGameTeamMaxPlayers.description)}
                        </SettingDescription>
                        {SetCustomGameTeamMaxPlayers.teams.map((v, i) => {
                            const api = apiList.find(
                                (v2) =>
                                    v2.Namespace === GameRules &&
                                    v2.FuncName === 'SetCustomGameTeamMaxPlayers' &&
                                    v2.Params[0] === v.enum
                            );
                            let value = v.default;
                            if (api && typeof api.Params[1] === 'string') {
                                value = parseInt(api.Params[1]);
                                if (isNaN(value)) {
                                    value = v.default;
                                }
                            }
                            return (
                                <SettingContainer key={i}>
                                    <SettingFunction>
                                        <SettingFunctionName style={{ width: 187 }}>
                                            {'- ' + v.enum}
                                        </SettingFunctionName>
                                        {'('}
                                        <EditableText
                                            style={{
                                                width: 50,
                                                textAlign: 'center',
                                                borderRadius: 10000,
                                            }}
                                            renderState={renderNumericState}
                                            defaultValue={value.toString()}
                                            onComplete={(text) => {
                                                request('SetCustomGameTeamMaxPlayers', {
                                                    team: v.enum,
                                                    value: parseInt(text) || 0,
                                                });
                                            }}
                                        />
                                        {')'}
                                    </SettingFunction>
                                </SettingContainer>
                            );
                        })}
                    </SettingContainer>
                </div>
            </SettingsRoot>
        </CacheProvider>
    );
}

const app = document.getElementById('app');
ReactDOM.render(<CustomGameSettings />, app);
