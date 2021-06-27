const data = require('./media/javascript_api_ts.json');
const { writeFileSync } = require('fs');

let fileContent = `
declare type Vector = number[];
declare type QAngle = number[];

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

declare type CSSProperties = {
    '-s2-mix-blend-mode': string,
    align: string,
    animation: string,
    'animation-delay': string,
    'animation-direction': string,
    'animation-duration': string,
    'animation-iteration-count': string,
    'animation-name': string,
    'animation-timing-function': string,
    'background-blur': string,
    'background-color': string,
    'background-image': string,
    'background-position': string,
    'background-repeat': string,
    'background-size': string,
    blur: string,
    border: string,
    'border-bottom': string,
    'border-bottom-color': string,
    'border-bottom-left-radius': string,
    'border-bottom-right-radius': string,
    'border-bottom-style': string,
    'border-bottom-width': string,
    'border-color': string,
    'border-left': string,
    'border-left-color': string,
    'border-left-style': string,
    'border-left-width': string,
    'border-radius': string,
    'border-right': string,
    'border-right-color': string,
    'border-right-style': string,
    'border-right-width': string,
    'border-style': string,
    'border-top': string,
    'border-top-color': string,
    'border-top-left-radius': string,
    'border-top-right-radius': string,
    'border-top-style': string,
    'border-top-width': string,
    'border-width': string,
    'box-shadow': string,
    brightness: string,
    clip: string,
    color: string,
    'context-menu-arrow-position': string,
    'context-menu-body-position': string,
    'context-menu-position': string,
    contrast: string,
    'flow-children': 'none' | 'down' | 'right' | 'right-wrap',
    font: string,
    'font-family': string,
    'font-size': string,
    'font-stretch': string,
    'font-style': string,
    'font-weight': string,
    height: string,
    'horizontal-align': string,
    'hue-rotation': string,
    'img-shadow': string,
    'letter-spacing': string,
    'line-height': string,
    margin: string,
    'margin-bottom': string,
    'margin-left': string,
    'margin-right': string,
    'margin-top': string,
    'max-height': string,
    'max-width': string,
    'min-height': string,
    'min-width': string,
    opacity: string,
    'opacity-mask': string,
    'opacity-mask-scroll-down': string,
    'opacity-mask-scroll-up': string,
    'opacity-mask-scroll-up-down': string,
    overflow: string,
    padding: string,
    'padding-bottom': string,
    'padding-left': string,
    'padding-right': string,
    'padding-top': string,
    perspective: string,
    'perspective-origin': string,
    position: string,
    'pre-transform-rotate2d': string,
    'pre-transform-scale2d': string,
    saturation: string,
    sound: string,
    'sound-out': string,
    'text-align': string,
    'text-decoration': string,
    'text-decoration-style': string,
    'text-overflow': string,
    'text-shadow': string,
    'text-transform': string,
    'texture-sampling': string,
    'tooltip-arrow-position': string,
    'tooltip-body-position': string,
    'tooltip-position': string,
    transform: string,
    'transform-origin': string,
    transition: string,
    'transition-delay': string,
    'transition-duration': string,
    'transition-property': string,
    'transition-timing-function': string,
    'ui-scale': string,
    'ui-scale-x': string,
    'ui-scale-y': string,
    'ui-scale-z': string,
    'vertical-align': string,
    visibility: string,
    'wash-color': string,
    'white-space': string,
    width: string,
    x: string,
    y: string,
    z: string,
    'z-index': string,
    animationDelay: string,
    animationDirection: string,
    animationDuration: string,
    animationIterationCount: string,
    animationName: string,
    animationTimingFunction: string,
    backgroundBlur: string,
    backgroundColor: string,
    backgroundImage: string,
    backgroundPosition: string,
    backgroundRepeat: string,
    backgroundSize: string,
    borderBottom: string,
    borderBottomColor: string,
    borderBottomLeftRadius: string,
    borderBottomRightRadius: string,
    borderBottomStyle: string,
    borderBottomWidth: string,
    borderColor: string,
    borderLeft: string,
    borderLeftColor: string,
    borderLeftStyle: string,
    borderLeftWidth: string,
    borderRadius: string,
    borderRight: string,
    borderRightColor: string,
    borderRightStyle: string,
    borderRightWidth: string,
    borderStyle: string,
    borderTop: string,
    borderTopColor: string,
    borderTopLeftRadius: string,
    borderTopRightRadius: string,
    borderTopStyle: string,
    borderTopWidth: string,
    borderWidth: string,
    boxShadow: string,
    contextMenuArrowPosition: string,
    contextMenuBodyPosition: string,
    contextMenuPosition: string,
    flowChildren: 'none' | 'down' | 'right' | 'right-wrap',
    fontFamily: string,
    fontSize: string,
    fontStretch: string,
    fontStyle: string,
    fontWeight: string,
    horizontalAlign: string,
    hueRotation: string,
    imgShadow: string,
    letterSpacing: string,
    lineHeight: string,
    marginBottom: string,
    marginLeft: string,
    marginRight: string,
    marginTop: string,
    maxHeight: string,
    maxWidth: string,
    minHeight: string,
    minWidth: string,
    opacityMask: string,
    opacityMaskScrollDown: string,
    opacityMaskScrollUp: string,
    opacityMaskScrollUpDown: string,
    paddingBottom: string,
    paddingLeft: string,
    paddingRight: string,
    paddingTop: string,
    perspectiveOrigin: string,
    preTransformRotate2d: string,
    preTransformScale2d: string,
    soundOut: string,
    textAlign: string,
    textDecoration: string,
    textDecorationStyle: string,
    textOverflow: string,
    textShadow: string,
    textTransform: string,
    textureSampling: string,
    tooltipArrowPosition: string,
    tooltipBodyPosition: string,
    tooltipPosition: string,
    transformOrigin: string,
    transitionDelay: string,
    transitionDuration: string,
    transitionProperty: string,
    transitionTimingFunction: string,
    uiScale: string,
    uiScaleX: string,
    uiScaleY: string,
    uiScaleZ: string,
    verticalAlign: string,
    washColor: string,
    whiteSpace: string,
    zIndex: string,
};

`;

const extendsTable = {
    Panel: '',
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
    DOTAHUDOverlayMap: 'Panel',
};
const elementList = Object.keys(extendsTable);
elementList.sort();

for (const [k, list] of Object.entries(data)) {
    if (k === 'Constants') {
        continue;
    }

    let extendsText = '';
    if (extendsTable[k]) {
        extendsText = `extends ${extendsTable[k]} `;
    }

    if (k === '$') {
        fileContent += `declare const ${k}: IPanorama;\n`;
        fileContent += `declare interface IPanorama {\n`;

        fileContent += `    /**\n     * $<Label>("#label-id")\n     */\n`;
        fileContent += `    <T = Panel>(id: string) : T;\n`;
    } else if (elementList.includes(k)) {
        fileContent += `declare interface ${k} ${extendsText}{\n`;
    } else {
        fileContent += `declare const ${k}: I${k};\n`;
        fileContent += `declare interface I${k} {\n`;
    }

    list.forEach((v) => {
        if (v.desc) {
            fileContent += `    /**\n     * ${v.desc}\n     */\n`;
        }

        if (v.name === 'Subscribe') {
            fileContent += `    Subscribe<T = any>( pEventName: string, callback: (data: T) => void ): number;\n`;
        } else if (v.name === 'SendCustomGameEventToServer') {
            fileContent += `    SendCustomGameEventToServer<T = any>( pEventName: string, data: T ): number;\n`;
        } else if (v.name === 'SendCustomGameEventToAllClients') {
            fileContent += `    SendCustomGameEventToAllClients<T = any>( pEventName: string, data: T ): number;\n`;
        } else if (v.name === 'SendCustomGameEventToClient') {
            fileContent += `    SendCustomGameEventToClient<T = any>( pEventName: string, playerIndex: number, data: T ): number;\n`;
        } else if (v.name === 'SendEventClientSide') {
            fileContent += `    SendEventClientSide<T = any>( pEventName: string, data: T ): number;\n`;
        } else if (v.name === 'style') {
            fileContent += `    style: CSSProperties;\n`;
        } else if (v.name === 'FindChildrenWithClassTraverse') {
            fileContent += `    FindChildrenWithClassTraverse<T = Panel>( className: string ): T[];\n`;
        } else if (v.name === 'FindChild') {
            fileContent += `    FindChild<T = Panel>( id: string ): T | undefined;\n`;
        } else if (v.name === 'FindChildTraverse') {
            fileContent += `    FindChildTraverse<T = Panel>( id: string ): T | undefined;\n`;
        } else if (v.name === 'FindChildInLayoutFile') {
            fileContent += `    FindChildInLayoutFile<T = Panel>( f: string ): T | undefined;\n`;
        } else if (v.name === 'FindPanelInLayoutFile') {
            fileContent += `    FindPanelInLayoutFile<T = Panel>( f: string ): T | undefined;\n`;
        } else if (v.name === 'GetChild') {
            fileContent += `    GetChild<T = Panel>( index: number ): T | undefined;\n`;
        } else {
            fileContent += `    ${v.name + v.func + ': ' + v.return};\n`;
        }

        if (v.name === 'CreatePanel') {
            elementList.forEach((tag) => {
                fileContent += `    CreatePanel( tagName: '${tag}', parent: Panel, id: string ): ${tag} | undefined;\n`;
            });
        } else if (v.name === 'CreatePanelWithProperties') {
            elementList.forEach((tag) => {
                fileContent += `    CreatePanelWithProperties( tagName: '${tag}', parent: Panel, id: string, properties: {[key: string]: string} ): ${tag} | undefined;\n`;
            });
        }
    });
    fileContent += '}\n\n';
}

for (const [k, list] of Object.entries(data['Constants'])) {
    fileContent += `declare enum ${k} {\n`;
    list.forEach((v) => {
        if (v.desc) {
            fileContent += `    /**\n     * ${v.desc}\n     */\n`;
        }
        fileContent += `    ${v.name + ' = ' + v.value},\n`;
    });
    fileContent += '}\n\n';
}

writeFileSync('./vjs.d.ts', fileContent);
