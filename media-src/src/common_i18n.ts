const i18n: {
    [key: string]: {
        copy: string;
        select_all: string;
        remove: string;
        delete: string;
    };
} = {
    en: {
        copy: 'Copy',
        select_all: 'Select All',
        remove: 'Remove',
        delete: 'Delete',
    },
    'zh-cn': {
        copy: '复制',
        select_all: '全选',
        remove: '删除',
        delete: '删除',
    },
};

const commonText = i18n[navigator.language] || i18n['en'];
export default commonText;
