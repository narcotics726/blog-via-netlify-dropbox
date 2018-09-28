import * as fs from 'fs';
import * as util from 'util';
import needle from 'needle';
import AdmZip from 'adm-zip';
import * as path from 'path';

const fsp = {
    writeFile: util.promisify(fs.writeFile)
};

const extractZip = function (zipPath: string) {
    const zip = new AdmZip(zipPath);
    const tasks = zip.getEntries()
        .filter(entry =>
            !entry.isDirectory &&
            (entry.name.toLowerCase().endsWith('md') || entry.entryName.startsWith('blogs/images')) &&
            entry.entryName.startsWith('blogs/') &&
            !entry.entryName.startsWith('blogs/draft')
        ).reduce((groups: AdmZip.IZipEntry[][], entry: AdmZip.IZipEntry) => {
            const key = entry.name.toLowerCase().endsWith('md') ? 0 : 1;
            groups[key].push(entry);
            return groups;
        }, [[], []])
        .map((group: AdmZip.IZipEntry[], index: number) => {
            let rootDir = './source/_posts';
            if (index === 1) {
                rootDir = './source/images';
            }
            return group.map(entry =>
                fsp.writeFile(
                    path.resolve(rootDir, entry.name.toLowerCase()),
                    entry.getData()
                )
            );
        }).reduce((arr: Promise<void>[], group: Promise<void>[]) => {
            return arr.concat(group);
        }, []);
    return Promise.all(tasks);
};

const downloadZip = function () {
    console.log('token: ' + process.env['DROPBOX_TOKEN']);
    return needle(
        'post',
        'https://content.dropboxapi.com/2/files/download_zip',
        {},
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

        return fsp.writeFile('./t.zip', res.body);
    }).then(() => {
        return './t.zip';
    });
};

const func = async function () {
    return downloadZip().then(extractZip);
};

func().then(() => process.exit(0)).catch(err => {
    console.log(err);
    process.exit(-1);
});