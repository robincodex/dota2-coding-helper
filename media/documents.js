
const root = document.getElementById('root');
let lastCategory = '';
let lastSelectedFileElement = null;

function swapCategory( name ) {
    const docsFiles = root.querySelector(`#docs-files`);
    lastCategory = name;

    let fileList = '';
    const files = window.dirsInfo[name];
    for(const f of files) {
        fileList += `<div class="file" data-file="${f}">${f.split('.')[0]}</div>`;
    }
    docsFiles.innerHTML = fileList;

    const content = root.querySelector('#docs-content');
    content.innerHTML = '';
}

async function showContent( file ) {
    const res = await fetch(`${window.docsUri}/${lastCategory}/${file}`);
    const content = root.querySelector('#docs-content');
    content.innerHTML = await res.text();
    content.scrollTop = 0;
}

/** @type {HTMLImageElement} */
let lastImageForLightbox = null;

/**
 * @param {HTMLImageElement} img 
 */
function showLightbox( img ) {
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
    while(currentImage.previousElementSibling) {
        const nextImage = currentImage.previousElementSibling;
        if (!(nextImage instanceof HTMLImageElement)) {
            return;
        }
        const alt = nextImage.getAttribute('alt');
        if (alt === 'box-static') {
            currentImage = nextImage;
            continue;
        }
        else if (alt === 'box') {
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
    while(currentImage.nextElementSibling) {
        const nextImage = currentImage.nextElementSibling;
        if (!(nextImage instanceof HTMLImageElement)) {
            return;
        }
        const alt = nextImage.getAttribute('alt');
        if (alt === 'box-static') {
            currentImage = nextImage;
            continue;
        }
        else if (alt === 'box') {
            showLightbox(nextImage);
        }
        return;
    }
}

/**
 * @param {MouseWheelEvent} event 
 */
function onLightboxMouseWheel( event ) {
    console.log("onLightboxMouseWheel");
    event.preventDefault();
    if (event.deltaY < 0) {
        previousLightboxImage();
    } else {
        nextLightboxImage();
    }
}

(async function(){
    let category = '';
    Object.keys(window.dirsInfo).sort().forEach((v) => {
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
        <div id="docs-content" class="markdown-body">
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
        }
        else if (ev.target instanceof HTMLImageElement && ev.target.getAttribute("alt") === 'box') {
            showLightbox(ev.target);
        }
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
})();
