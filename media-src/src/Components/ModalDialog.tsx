function GetContextPanel() {
    let elem = document.getElementById('modal-dialog-panel');
    if (!elem) {
        elem = document.body.appendChild(document.createElement('div'));
        elem.id = 'modal-dialog-panel';
        elem.style.display = 'none';
        elem.style.position = 'fixed';
        elem.style.top = '0';
        elem.style.bottom = '0';
        elem.style.left = '0';
        elem.style.right = '0';
        elem.style.pointerEvents = 'none';
    }
    return elem;
}

export function ShowModalDialog(content: React.ReactNode) {}
