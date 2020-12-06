const i18n: {
    [key: string]: {
        copy: string;
        select_all: string;
        remove: string;
        delete: string;
        paste: string;
        add: string;
        ok: string;
        cancel: string;
    };
} = {
    en: {
        copy: 'Copy',
        select_all: 'Select All',
        remove: 'Remove',
        delete: 'Delete',
        paste: 'Paste',
        add: 'Add',
        ok: 'OK',
        cancel: 'Cancel',
    },
    'zh-cn': {
        copy: '复制',
        select_all: '全选',
        remove: '删除',
        delete: '删除',
        paste: '粘贴',
        add: '添加',
        ok: '确定',
        cancel: '取消',
    },
};

const commonText = i18n[navigator.language.toLowerCase()] || i18n['en'];
export default commonText;
