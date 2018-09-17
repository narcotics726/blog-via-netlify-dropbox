'use strict';

const helloFunc = require('./lib/hello.tool');
const fs = require('fs');
const childProcess = require('child_process');

exports.handler = function (event, context, callback) {
    console.log(event);
    console.log(context);
    fs.readdir('./source/_posts', (err, files) => {
        if (err) {
            return callback(err, {statusCode: 500});
        }

        fs.writeFile('./source/_posts/test.md', '#Test Blog From Function', (err) => {
            if (err) {
                return callback(err);
            }

            childProcess.execSync('./node_modules/.bin/hexo generate');

            return callback(null, { statusCode: 200, body: JSON.stringify(files) });
        })

    });
};