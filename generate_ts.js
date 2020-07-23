const data = require('./media/javascript_api_ts.json');
const { writeFileSync } = require('fs');

let fileContent = `
type Vector = number[];
type QAngle = number[];

declare interface ITeamDetails {
    team_id: number;
    team_name: string;
    team_max_players: number;
    team_score: number;
    team_num_players: number;
}

declare interface IPlayerInfo {
    player_id: number;
    player_name: string;
    player_connection_state: number;
    player_steamid: string;
    player_kills: number;
    player_deaths: number;
    player_assists: number;
    player_selected_hero_id: number;
    player_selected_hero: string;
    player_selected_hero_entity_index: number;
    possible_hero_selection: string;
    player_level: number;
    player_respawn_seconds: number;
    player_gold: number;
    player_team_id: number;
    player_is_local: boolean;
    player_has_host_privileges: boolean;
}

declare interface IMapInfo {
    map_name: string;
    map_display_name: string;
}

declare type MouseCallbackEventType = 'pressed' | 'wheeled' | 'doublepressed';

type PanelEvent =
    | 'onactivate'
    | 'oncancel'
    | 'oncontextmenu'
    | 'ondblclick'
    | 'ondeselect'
    | 'oneconsetloaded'
    | 'onfilled'
    | 'onfindmatchend'
    | 'onfindmatchstart'
    | 'onfocus'
    | 'oninputsubmit'
    | 'onload'
    | 'onmouseactivate'
    | 'onmouseout'
    | 'onmouseover'
    | 'onmovedown'
    | 'onmoveleft'
    | 'onmoveright'
    | 'onmoveup'
    | 'onnotfilled'
    | 'onpagesetupsuccess'
    | 'onpopupsdismissed'
    | 'onselect'
    | 'ontabforward'
    | 'ontextentrychange'
    | 'ontextentrysubmit'
    | 'ontooltiploaded'
    | 'onvaluechanged';

declare interface IAsyncWebRequestResponse {
    statusText: string;
    responseText: string | null;
    status: number;
}

declare interface IAsyncWebRequestData {
    type?: string;
    timeout?: number;
    headers?: object;
    data?: object;
    success?(response: any, result: 'success', statusText: string): void;
    error?(data: IAsyncWebRequestResponse, result: 'error', statusText: string): void;
    complete?(data: IAsyncWebRequestResponse, result: 'success' | 'error'): void;
}

declare interface PrepareUnitOrdersArgument {
    OrderType: dotaunitorder_t;
    TargetIndex?: number;
    Position?: [number, number, number];
    AbilityIndex?: number;
    OrderIssuer?: PlayerOrderIssuer_t;
    UnitIndex?: number;
    QueueBehavior?: OrderQueueBehavior_t;
    ShowEffects?: boolean;
}

`;

const extendsTable = {
    Label: 'Panel',
    Button: 'Panel',
    TabButton: 'Panel',
    TextButton: 'Panel',
    RadioButton: 'Panel',
    ToggleButton: 'Panel',
    DropDown: 'Panel',
    ProgressBar: 'Panel',
    TextEntry: 'Panel',
    NumberEntry: 'Panel',
    Image: 'Panel',
    Carousel: 'Panel',
    Movie: 'Panel',
    DOTAAvatarImage: 'Image',
    DOTAAbilityImage: 'Image',
    DOTAItemImage: 'Image',
    DOTAHeroImage: 'Image',
    DOTAUserName: 'Panel',
    DOTAScenePanel: 'Panel',
    DOTAAbilityPanel: 'Panel',
    DOTAHTMLPanel: 'Panel',
};
const elementList = Object.keys(extendsTable);
elementList.sort();

for(const [k, list] of Object.entries(data)) {
    if (k === 'Constants') {
        continue;
    }

    let extendsText = '';
    if (extendsTable[k]) {
        extendsText = `extends ${extendsTable[k]} `;
    }

    fileContent += `declare interface ${k} ${extendsText}{\n`;

    if (k === '$') {
        fileContent += `    /**\n     * $<Label>("#label-id")\n     */\n`;
        fileContent += `    <T = Panel>(id: string) : T;\n`;
    }

    list.forEach(v => {
        if (v.desc) {
            fileContent += `    /**\n     * ${v.desc}\n     */\n`;
        }

        if (v.name === 'Subscribe') {
            fileContent += `    Subscribe<T = any>( pEventName: string, callback: (data: T) => void ): number;\n`;
        }
        else if (v.name === 'SendCustomGameEventToServer') {
            fileContent += `    SendCustomGameEventToServer<T = any>( pEventName: string, data: T ): number;\n`;
        }
        else if (v.name === 'SendCustomGameEventToAllClients') {
            fileContent += `    SendCustomGameEventToAllClients<T = any>( pEventName: string, data: T ): number;\n`;
        }
        else if (v.name === 'SendCustomGameEventToClient') {
            fileContent += `    SendCustomGameEventToClient<T = any>( pEventName: string, playerIndex: number, data: T ): number;\n`;
        }
        else if (v.name === 'SendEventClientSide') {
            fileContent += `    SendEventClientSide<T = any>( pEventName: string, data: T ): number;\n`;
        }
        else {
            fileContent += `    ${v.name + v.func + ': ' + v.return};\n`;
        }

        if (v.name === 'CreatePanel') {
            elementList.forEach((tag) => {
                fileContent += `    CreatePanel( tagName: '${tag}', parent: Panel, id: string ): ${tag} | undefined;\n`;
            });
        }
        else if (v.name === 'CreatePanelWithProperties') {
            elementList.forEach((tag) => {
                fileContent += `    CreatePanelWithProperties( tagName: '${tag}', parent: Panel, id: string, properties: {[key: string]: string} ): ${tag} | undefined;\n`;
            });
        }
    });
    fileContent += '}\n\n';
}

for(const [k, list] of Object.entries(data['Constants'])) {
    fileContent += `declare enum ${k} {\n`;
    list.forEach(v => {
        if (v.desc) {
            fileContent += `    /**\n     * ${v.desc}\n     */\n`;
        }
        fileContent += `    ${v.name + ' = ' + v.value},\n`;
    });
    fileContent += '}\n\n';
}

writeFileSync('./vjs.d.ts', fileContent);