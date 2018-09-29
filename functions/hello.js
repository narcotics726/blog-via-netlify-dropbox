'use strict';

const helloFunc = require('./lib/hello.tool');
const fs = require('fs');
const childProcess = require('child_process');

exports.handler = function (event, context, callback) {
    console.log(`cwd: ${process.cwd()}`);
    fs.readdir('../', (err, files) => {
        if (err) {
            return callback(err, {statusCode: 500});
        }

            return callback(null, { statusCode: 200, body: JSON.stringify(files) });
        // })

    });
};