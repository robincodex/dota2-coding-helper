// @ts-check

let root;
let apiData = null;
let lastSelectedMenuItem = null;

/** @ts-ignore */
let usingJavascriptStyle = window.usingJavascriptStyle === true;

// Sort priority
const sortList = [
    'Globals',
    'CDOTA_PlayerResource',
    'CDOTAGamerules',
    'CBaseEntity',
    'CDOTABaseGameMode',
    'CDOTA_BaseNPC',
    'CDOTA_BaseNPC_Hero',
    'CDOTABaseAbility',
    'CDOTA_Ability_Lua',
    'CDOTA_Item',
    'CDOTA_Item_Lua',
    'CDOTA_Modifier_Lua',
    'CDOTA_Buff',
    'CScriptParticleManager',
    'ProjectileManager',
    'HTTPRequest',
    'CEntities',
    'CEntityInstance',
    'Convars',
    'GridNav',
    'CTakeDamageInfo',
    'Vector',
    'modifierfunction',
    'modifierpriority',
    'modifierstate',
    'modifierremove',
    'DOTATeam_t',
    'ParticleAttachment_t',
    'UnitFilterResult',
    'Attributes',
    'DAMAGE_TYPES',
    'DOTA_ABILITY_BEHAVIOR',
    'DOTA_GameState',
    'GameActivity_t',
    'LuaModifierType',
    'DOTA_UNIT_TARGET_FLAGS',
    'DOTA_UNIT_TARGET_TEAM',
    'DOTA_UNIT_TARGET_TYPE',
    'DOTA_SHOP_TYPE',
    'DOTA_RUNES',
    'EDOTA_ModifyGold_Reason',
    'EDOTA_ModifyXP_Reason',
    '$',
    'Game',
    'GameEvents',
    'GameUI',
    'Players',
    'Entities',
    'Abilities',
    'Items',
    'Buffs',
    'Particles',
    'Panel',
];

const Locale = (...args) => {
    //@ts-ignore
    let localeWord = window.localeData;
    args.forEach((element) => (localeWord = localeWord[element] || localeWord));
    return localeWord.constructor == String ? localeWord : '';
};

// On location.hash change
function onHashChange() {
    let className = location.hash.replace('#', '');
    if (!className) {
        return;
    }

    // Change selected class
    let menuItemList = root.querySelector('#menu-item-list');
    for (let i = 0; i < menuItemList.children.length; i++) {
        const element = menuItemList.children.item(i);
        if (element.innerHTML === className) {
            if (lastSelectedMenuItem) {
                lastSelectedMenuItem.classList.remove('selected');
            }
            element.classList.add('selected');
            lastSelectedMenuItem = element;
            break;
        }
    }

    // Show api list
    let data = apiData[className];
    let isConstants = false;
    if (!data) {
        data = apiData['Constants'][className];
        isConstants = true;
    }
    const apiListContainer = root.querySelector('#api-list-container');
    apiListContainer.innerHTML = renderClasses(className, data, isConstants);
    apiListContainer.scrollTop = 0;
}

/** Render list of API */
function renderClasses(title, data, isContant) {
    if (!data) {
        return '';
    }

    /** single TypeScript api */
    const getItem_js = (apiInfo) => {
        /**
         * @param {string} funcName
         */
        const renderParam = (funcName) => {
            const list = funcName.match(/[\.\w\d_]+\:\s*[\w\d\_\|\[\]\. ]+/g);
            if (!list) {
                return funcName;
            }
            for (let i = list.length - 1; i >= 0; i--) {
                const str = list[i];
                const strList = str.split(/\:\s*/);
                if (strList.length === 1) {
                    funcName = funcName.replace(
                        str,
                        `<span class="func-param-name">${strList[0]}</span>: `
                    );
                } else if (strList.length === 2) {
                    funcName = funcName.replace(
                        str,
                        `<span class="func-param-name">${strList[0]}</span>: <span class="func-param-type">${strList[1]}</span>`
                    );
                }
            }
            return funcName;
        };
        return `<tr>
            <td>
                <div class="function">
                    <span class="func-name">${apiInfo.name}</span>
                    <span class="func-params">${renderParam(apiInfo.func)}</span>:
                    <span class="func-return"> ${apiInfo.return}</span>
                </div>
                <div>${apiInfo.desc}</div>
                <div>${Locale(title, apiInfo.name)}</div>
            </td>
        </tr>`;
    };

    /** single lua api */
    const getItem_lua = (apiInfo) => {
        return `<tr>
            <td>
                <div class="function">
                    <span class="func-return">${apiInfo.return}</span>
                    <span class="func-name">${apiInfo.name}</span>
                    <span class="func-params">${apiInfo.func}</span>
                </div>
                <div>${apiInfo.desc}</div>
                <div>${Locale(title, apiInfo.name)}</div>
            </td>
        </tr>`;
    };

    /** single contant enum */
    const getItem_constant = (apiInfo) => {
        return `<tr>
            <td>
                <div class="function">
                    <span class="func-name">${apiInfo.name}</span>
                    <span class="constant-value">${apiInfo.value}</span>
                </div>
                <div>${apiInfo.desc}</div>
                <div>${Locale(title, apiInfo.name)}</div>
            </td>
        </tr>`;
    };
    let getItem = isContant ? getItem_constant : usingJavascriptStyle ? getItem_js : getItem_lua;
    let body = '';
    for (let i = 0; i < data.length; i++) {
        body += getItem(data[i]);
    }
    let extend = Locale(title, '__extends');
    let variable = Locale(title, '__globalAccessorVariable');
    return `<div>
        <span class="api-title">${title}</span>
        ${extend ? `extends <span class="func-return">${extend}</span>` : ''}
        ${variable ? `Global accessor variable <span class="func-name">${variable}</span>` : ''}
    </div>
    <div>${Locale(title, '__self')}</div>
    <table class="table api-list">
        <tbody> ${body} </tbody>
    </table>
    `;
}

function showClasses() {
    // Sort keys
    const keys = Object.keys(apiData);
    keys.sort((a, b) => {
        if (a === b) {
            return 0;
        }
        let c = sortList.indexOf(a);
        let d = sortList.indexOf(b);
        if (c >= 0 && d >= 0) {
            return sortList.indexOf(a) < sortList.indexOf(b) ? -1 : 1;
        } else if (c >= 0) {
            return -1;
        } else if (d >= 0) {
            return 1;
        }
        return a > b ? 1 : -1;
    });

    root.querySelector('#menu-item-list').innerHTML = keys.reduce((pv, v, i) => {
        if (i === 1) {
            pv = `<div class="menu-item" hash="#${pv}">${pv}</div>`;
        }
        if (v === 'Constants') {
            return pv;
        }
        return pv + `<div class="menu-item" hash="#${v}">${v}</div>`;
    });

    if (!apiData[location.hash.replace('#', '')]) {
        location.hash = 'Globals';
    } else {
        const h = location.hash;
        location.hash = '';
        location.hash = h;
    }
}

function showContants() {
    // Sort keys
    const keys = Object.keys(apiData['Constants']);
    keys.sort((a, b) => {
        if (a === b) {
            return 0;
        }
        let c = sortList.indexOf(a);
        let d = sortList.indexOf(b);
        if (c >= 0 && d >= 0) {
            return sortList.indexOf(a) < sortList.indexOf(b) ? -1 : 1;
        } else if (c >= 0) {
            return -1;
        } else if (d >= 0) {
            return 1;
        }
        return a > b ? 1 : -1;
    });

    root.querySelector('#menu-item-list').innerHTML = keys.reduce((pv, v, i) => {
        if (i === 1) {
            pv = `<div class="menu-item" hash="#${pv}">${pv}</div>`;
        }
        return pv + `<div class="menu-item" hash="#${v}">${v}</div>`;
    });

    if (!apiData['Constants'][location.hash.replace('#', '')]) {
        location.hash = 'DOTATeam_t';
    } else {
        const h = location.hash;
        location.hash = '';
        location.hash = h;
    }
}

/**
 * @param {string} value
 */
function onSearch(value) {
    value = value.trim();
    if (!value) {
        let menuHeader = root.querySelector('#menu-header');
        if (menuHeader.children.item(0).classList.contains('selected')) {
            showClasses();
        } else {
            showContants();
        }
        return;
    }

    const list = value.split(/\s+/).map((v) => new RegExp(v, 'i'));
    const resultList = {};
    const search_datas = (datas, k, find) => {
        for (const v of datas) {
            if (find(v)) {
                let apiList = resultList[k];
                if (!apiList) {
                    resultList[k] = apiList = [];
                }
                apiList.push(v);
            }
        }
    };
    for (const k in apiData) {
        if (k === 'Constants') {
            const Constants = apiData[k];
            for (const c in Constants) {
                search_datas(
                    Constants[c],
                    c,
                    (v) =>
                        list.filter(
                            (e) =>
                                Locale(c, v.name).search(e) >= 0 ||
                                v.desc.search(e) >= 0 ||
                                v.name.search(e) >= 0
                        ).length > 0
                );
            }
            continue;
        }

        search_datas(
            apiData[k],
            k,
            (v) =>
                list.filter(
                    (e) =>
                        Locale(k, v.name).search(e) >= 0 ||
                        v.desc.search(e) >= 0 ||
                        v.name.search(e) >= 0 ||
                        v.func.search(e) >= 0 ||
                        v.return.search(e) >= 0
                ).length > 0
        );
    }

    // Sort keys
    const keys = Object.keys(resultList);
    keys.sort((a, b) => {
        if (a === b) {
            return 0;
        }
        let c = sortList.indexOf(a);
        let d = sortList.indexOf(b);
        if (c >= 0 && d >= 0) {
            return sortList.indexOf(a) < sortList.indexOf(b) ? -1 : 1;
        } else if (c >= 0) {
            return -1;
        } else if (d >= 0) {
            return 1;
        }
        return a > b ? 1 : -1;
    });

    // Show result
    let html = '';
    for (const k of keys) {
        let isConstants = false;
        if (!apiData[k]) {
            isConstants = !!apiData['Constants'][k];
        }
        html += renderClasses(k, resultList[k], isConstants);
    }
    const apiListContainer = root.querySelector('#api-list-container');
    apiListContainer.innerHTML = html;
    apiListContainer.scrollTop = 0;
}

window.onload = async function () {
    root = document.getElementById('root');

    // @ts-ignore Fetch api data;
    const res = await fetch(window.apiUri);
    apiData = await res.json();

    // Initialize html
    root.innerHTML = `
    <div id="search-container"><input id="search-input" type="text" placeholder="${Locale(
        'lua_api_search_tip'
    )}" /></div>
    <div id="api-container">
        <div id="menu">
            <div id="menu-header">
                <div class="selected">Classes</div>
                <div>Constants</div>
            </div>
            <div id="menu-item-list">
            </div>
        </div>
        <div id="api-list-container"></div>
    </div>
    `;
    window.addEventListener('hashchange', onHashChange);
    showClasses();

    // Add some event to #search-input
    /** @type {HTMLInputElement} */
    const searchInput = root.querySelector('#search-input');
    searchInput.addEventListener('change', (ev) => {
        ev.stopPropagation();
        if (ev.target instanceof HTMLInputElement) {
            onSearch(ev.target.value);
        }
    });
    searchInput.addEventListener('input', (ev) => {
        ev.stopPropagation();
        if (ev.target instanceof HTMLInputElement) {
            if (!ev.target.value) {
                onSearch(ev.target.value);
            }
        }
    });
    searchInput.addEventListener('keydown', (ev) => {
        ev.stopPropagation();
        // @ts-ignore
        if (ev.key === 'Enter') {
            if (ev.target instanceof HTMLInputElement) {
                onSearch(ev.target.value);
            }
        }
    });

    // Click on the menu-header's children to change selected state
    root.querySelector('#menu-header').addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (ev.target instanceof HTMLDivElement) {
            if (ev.target.classList.contains('selected')) {
                return;
            }
            ev.target.classList.add('selected');
            if (ev.target.innerText === 'Constants') {
                ev.target.previousElementSibling.classList.remove('selected');
                showContants();
            } else {
                ev.target.nextElementSibling.classList.remove('selected');
                showClasses();
            }
        }
    });

    // Click on the menu-item to change location.hash
    root.querySelector('#menu-item-list').addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (ev.target instanceof HTMLDivElement && ev.target.classList.contains('menu-item')) {
            if (searchInput.value.length > 0 && location.hash === ev.target.getAttribute('hash')) {
                searchInput.value = '';
                onSearch('');
                return;
            }
            location.hash = ev.target.getAttribute('hash');
        }
    });

    setTimeout(() => searchInput.focus(), 0);
};
