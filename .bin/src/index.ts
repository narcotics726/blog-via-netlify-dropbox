import * as fs from 'fs';
import * as util from 'util';
import needle from 'needle';
import AdmZip from 'adm-zip';
import * as path from 'path';


const fsp = {
    writeFile: util.promisify(fs.writeFile),
    unlink: util.promisify(fs.unlink)
};

const ZIP_FILE_PATH = './blogs.zip';

const extractZip = function () {
    const zip = new AdmZip(ZIP_FILE_PATH);
    const tasks = zip.getEntries()
        .filter(entry =>
            !entry.isDirectory &&
            entry.name.toLowerCase().endsWith('md') &&
            entry.entryName.startsWith('blogs/') &&
            !entry.entryName.includes('draft')
        )
        .map(entry => {
            return fsp.writeFile(path.resolve('./source/_posts', entry.name.toLowerCase()), entry.getData());
        });
    return Promise.all(tasks).then(() => tasks.length);
};

const downloadZip = function () {
    return needle(
        'post',
        'https://content.dropboxapi.com/2/files/download_zip',
        null,
        {
            headers: {
                'Authorization': `Bearer ${process.env['DROPBOX_TOKEN']}`,
                'Dropbox-API-Arg': JSON.stringify({
                    'path': '/blogs'
                })
            }
        }
    ).then(res => {
        if (res.statusCode !== 200) {
            throw new Error(`failed to download zip: ${res.body}`);
        }

        return fsp.writeFile(ZIP_FILE_PATH, res.body);
    });
};

const removePlaceHolderBlog = function (blogFileCount: number) {
    if (blogFileCount <= 0) {
        return Promise.resolve();
    }

    return fsp.unlink('./source/_posts/hello-world.md').catch(err => console.log(err));
};

const func = async function () {
    return downloadZip().then(extractZip).then(removePlaceHolderBlog);
};

func().then(() => process.exit(0)).catch(err => {
    console.log(err);
    process.exit(-1);
});