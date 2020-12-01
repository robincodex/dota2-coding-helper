export type BaseElementAttributes = {
    className?: string;
    style?: React.CSSProperties;
};

export function searchString(src: string, target: string): boolean {
    let index = 0;
    for (let i = 0; i < target.length; i++) {
        const s = target[i];
        if (s === ' ') {
            continue;
        }
        index = src.indexOf(s, index);
        if (index < 0) {
            return false;
        }
        index++;
    }
    return true;
}
