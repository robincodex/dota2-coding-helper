const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const hljs = require('highlight.js');
const cheerio = require('cheerio');
const imageUri = require('image-data-uri');

let converter = new showdown.Converter();
converter.setOption('tables', true);
converter.setOption('tasklists', true);
converter.setOption('strikethrough', true);
converter.setOption('emoji', true);

async function generate_docs() {
    if (!fs.existsSync("./media/docs")) {
        await fs.promises.mkdir('./media/docs');
    }

    const dirs = await fs.promises.readdir('./docs');
    for(const category of dirs) {
        const srcPath = `./docs/${category}`;
        const targetPath = `./media/docs/${category}`;
        if (!fs.existsSync(targetPath)) {
            await fs.promises.mkdir(targetPath);
        }

        const files = await fs.promises.readdir(srcPath);
        for(const f of files) {
            if (!f.endsWith(".md")) {
                continue;
            }
            const content = await fs.promises.readFile(`${srcPath}/${f}`, {encoding: 'utf8'});
            const html = converter.makeHtml(content);

            // Render code using highlight.js
            const $ = cheerio.load(html);
            $("pre code").each((_, e) => {
                const code = $(e);
                const hlCode = hljs.highlightAuto(code.text(), code.attr('class').split(/\s+/));
                code.html(hlCode.value);
            });

            // Replace image data
            const imgWorker = () => {
                return new Promise((resolve) => {
                    const imgList = $("img");
                    if (imgList.length <= 0) {
                        resolve();
                        return;
                    }
                    imgList.each(async (i, e) => {
                        const img = $(e);
                        const imgPath = path.resolve(srcPath, img.attr('src'));
                        if (!fs.existsSync(imgPath)) {
                            if (imgList.length-1 === i) {
                                resolve();
                                return;
                            }
                            return;
                        }
                        const data = await imageUri.encodeFromFile(imgPath);
                        img.attr('src', data);
                        if (imgList.length-1 === i) {
                            resolve();
                            return;
                        }
                    });
                });
            };
            await imgWorker();

            const buf = Buffer.from(f.replace('.md','')).toString('hex');
            await fs.promises.writeFile(path.join( targetPath, `${buf.toString('ascii')}.html` ), $("body").html());
        }
    }

}

module.exports = async function(cb) {
    await generate_docs();
    cb();
};