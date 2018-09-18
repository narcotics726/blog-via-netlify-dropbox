import * as fs from 'fs';
import * as util from 'util';
import * as path from "path";

const fsp = {
    readdir: util.promisify(fs.readdir),
    stat: util.promisify(fs.stat),
    readFile: util.promisify(fs.readFile),
    writeFile: util.promisify(fs.writeFile)
};

const func = async function () {
    console.log(`build begin: ${process.cwd()}`);
    const dir = '/home/xiaoyuanqi/Dropbox/應用程式/myblog-node/blogs';
    let files = await Promise.all(
        (await fsp.readdir(dir, { withFileTypes: true }))
            .filter(f => f.isFile())
            .map(async f => {
                return {
                    name: f.name,
                    content: await fsp.readFile(path.resolve(dir, f.name), { encoding: 'utf8' })
                };
            })
    );

    const destDir = './source/_posts';
    await Promise.all(files.map(f => fsp.writeFile(path.resolve(destDir, f.name), f.content)));
    console.log('build end');
};

func().then(() => process.exit(0)).catch(err => {
    console.log(err);
    process.exit(-1);
});