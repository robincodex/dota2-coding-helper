
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

    root.addEventListener('click', (ev) => {
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
    });
})();
