import React from 'react';

export function Localization(props: { children?: React.ReactNode }) {
    const lang = document.documentElement.lang.toLowerCase();
    const children = React.Children.toArray(props.children).filter((v) => {
        if (typeof v !== 'object') {
            return false;
        }
        // @ts-ignore
        switch (v['type']) {
            case Chinese:
                return lang === 'zh-cn';
            case English:
                return lang === 'en';
            default:
                return false;
        }
    });
    return <div>{children}</div>;
}

export function Chinese(props: { children?: React.ReactNode }) {
    return <div>{props.children}</div>;
}

export function English(props: { children?: React.ReactNode }) {
    return <div>{props.children}</div>;
}
