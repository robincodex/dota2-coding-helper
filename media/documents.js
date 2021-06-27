let root;
let lastCategory = '';
let lastSelectedFileElement = null;

function swapCategory(name) {
    const docsFiles = root.querySelector(`#docs-files`);
    lastCategory = name;

    let fileList = '';
    const files = window.dirsInfo[name];
    for (const v of files) {
        fileList += `<div class="file" data-file="${v.filename}">${v.realname.split('.')[0]}</div>`;
    }
    docsFiles.innerHTML = fileList;

    const content = root.querySelector('#docs-content > #content-body');
    content.innerHTML = '';
    SetNavigation(null);
}

String.prototype.hexEncode = function () {
    var hex, i;

    var result = '';
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ('000' + hex).slice(-4);
    }

    return result;
};

async function showContent(file) {
    const res = await fetch(`${window.docsUri}/${lastCategory}/${file}`);
    /** @type {HTMLElement} */
    const content = root.querySelector('#docs-content > #content-body');
    content.innerHTML = await res.text();
    root.querySelector('#docs-content').scrollTop = 0;

    // Find headers, h1 and h2
    let chinese = /[\u4E00-\u9FA5]+/;
    let headers = [];
    for (let i = 0; i < content.children.length; i++) {
        const element = content.children.item(i);
        if (element instanceof HTMLElement) {
            if (element.tagName === 'H1') {
                if (chinese.test(element.innerText)) {
                    element.id = 'ID' + i + element.innerText.hexEncode();
                }
                headers.push({ id: element.id, text: element.innerText });
            } else if (element.tagName === 'H2') {
                if (chinese.test(element.innerText)) {
                    element.id = 'ID' + i + element.innerText.hexEncode();
                }
                let subList = headers[headers.length - 1];
                if (Array.isArray(subList)) {
                    subList.push({ id: element.id, text: element.innerText });
                } else {
                    headers.push([{ id: element.id, text: element.innerText }]);
                }
            }
        }
    }
    SetNavigation(headers);
}

/**
 * 显示导航
 * @param { ({id: string, text: string } | {id: string, text: string }[])[] } headers
 */
function SetNavigation(headers) {
    const navigation = root.querySelector('#docs-content #navigation-body');

    if (!headers) {
        navigation.innerHTML = '';
        return;
    }

    let html = '';
    for (const h of headers) {
        if (!Array.isArray(h)) {
            html += `<div class="nav-h1" data-id="${h.id}">${h.text}</div>`;
        } else {
            for (const c of h) {
                html += `<div class="nav-h2" data-id="${c.id}">${c.text}</div>`;
            }
        }
    }
    navigation.innerHTML = html;
}

/** @type {HTMLImageElement} */
let lastImageForLightbox = null;

/**
 * @param {HTMLImageElement} img
 */
function showLightbox(img) {
    const lightbox = root.querySelector('#lightbox');
    const container = lightbox.querySelector('#img-container');
    container.innerHTML = '';
    container.appendChild(img.cloneNode(false));
    lightbox.classList.add('show');
    lightbox.addEventListener('wheel', onLightboxMouseWheel);
    lastImageForLightbox = img;
}

function previousLightboxImage() {
    if (!lastImageForLightbox) {
        return;
    }
    let currentImage = lastImageForLightbox;
    while (currentImage.previousElementSibling) {
        const nextImage = currentImage.previousElementSibling;
        if (!(nextImage instanceof HTMLImageElement)) {
            return;
        }
        const alt = nextImage.getAttribute('alt');
        if (alt === 'box-static') {
            currentImage = nextImage;
            continue;
        } else if (alt === 'box') {
            showLightbox(nextImage);
        }
        return;
    }
}

function nextLightboxImage() {
    if (!lastImageForLightbox) {
        return;
    }
    let currentImage = lastImageForLightbox;
    while (currentImage.nextElementSibling) {
        const nextImage = currentImage.nextElementSibling;
        if (!(nextImage instanceof HTMLImageElement)) {
            return;
        }
        const alt = nextImage.getAttribute('alt');
        if (alt === 'box-static') {
            currentImage = nextImage;
            continue;
        } else if (alt === 'box') {
            showLightbox(nextImage);
        }
        return;
    }
}

/**
 * @param {MouseWheelEvent} event
 */
function onLightboxMouseWheel(event) {
    console.log('onLightboxMouseWheel');
    event.preventDefault();
    if (event.deltaY < 0) {
        previousLightboxImage();
    } else {
        nextLightboxImage();
    }
}

window.onload = async function () {
    root = document.getElementById('root');

    let category = '';
    Object.keys(window.dirsInfo)
        .sort()
        .forEach((v) => {
            category += `<div class="category-item">
            <input id="category-${v}" type="radio" name="category" />
            <label for="category-${v}" >${v}</label>
        </div>`;
        });

    root.innerHTML = `
    <div id="category">
        Category: ${category}
    </div>
    <div id="docs-container">
        <div id="docs-files">
        </div>
        <div id="docs-content" >
            <div id="navigation" >
                <div class="title">导航</div>
                <div id="navigation-body"></div>
            </div>
            <div id="content-body" class="markdown-body">
            </div>
        </div>
    </div>
    <div id="lightbox">
        <div id="left-arrow"></div>
        <div id="img-container"></div>
        <div id="right-arrow"></div>
    </div>
    `;

    const input = root.querySelector(`#category-Panorama`);
    input.checked = true;
    swapCategory('Panorama');

    root.addEventListener('change', (ev) => {
        if (ev.target instanceof HTMLInputElement) {
            const category = ev.target.id.replace('category-', '');
            if (category) {
                swapCategory(category);
            }
        }
    });

    root.querySelector('#docs-container').addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (ev.target instanceof HTMLDivElement && ev.target.classList.contains('file')) {
            const file = ev.target.getAttribute('data-file');
            if (file) {
                showContent(file);

                if (lastSelectedFileElement) {
                    lastSelectedFileElement.classList.remove('selected');
                }
                ev.target.classList.add('selected');
                lastSelectedFileElement = ev.target;
            }
        } else if (
            ev.target instanceof HTMLImageElement &&
            ev.target.getAttribute('alt') === 'box'
        ) {
            showLightbox(ev.target);
        }
    });

    /** @type {HTMLElement} */
    const navigation = root.querySelector('#docs-content #navigation');
    /** @type {HTMLElement} */
    const navigationBody = navigation.querySelector('#navigation-body');
    /** @type {HTMLElement} */
    const docsContent = root.querySelector('#docs-content');
    /** @type {HTMLElement} */
    const content = docsContent.querySelector('#content-body');
    navigationBody.addEventListener('click', (evt) => {
        evt.stopPropagation();
        if (evt.target instanceof HTMLElement) {
            const id = evt.target.getAttribute('data-id');
            /** @type {HTMLElement} */
            const elem = content.querySelector(`#${id}`);
            if (elem) {
                docsContent.scrollTop = elem.offsetTop;
            }
        }
    });
    navigation.addEventListener('mouseout', () => {
        if (navigation.matches(':hover')) {
            return;
        }
        navigation.scrollTop = 0;
    });

    const lightbox = root.querySelector('#lightbox');
    lightbox.addEventListener('click', (ev) => {
        if (ev.target instanceof HTMLDivElement) {
            if (ev.target.id === 'left-arrow') {
                previousLightboxImage();
                return;
            } else if (ev.target.id === 'right-arrow') {
                nextLightboxImage();
                return;
            }
            lightbox.classList.remove('show');
            lightbox.removeEventListener('wheel', onLightboxMouseWheel);
            lastImageForLightbox = null;
        }
    });
};
