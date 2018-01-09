/**
 * csvToJson.js
 * 
 * For the purpose of converting csv data tables into a json objects.
 */

const fs = require('fs');
const path = require('path');
const csv = require("csvtojson");

const dataDir = `../data/`;
let queue = [];

fs.readdirSync(dataDir)
    .forEach((fileName) => {
        if (fileName.endsWith(`.csv`)) {
            let filePath = path.join(dataDir, fileName);
            queue.push(filePath);
        }
    });

convertFileQueue(queue);

function convertFileQueue(__queue) {
    const filePath = __queue.shift();

    csv({
            trim: true
        })
        .fromFile(filePath)
        .on('end_parsed', (obj) => {
            fs.writeFileSync(filePath.replace('csv', 'json'), JSON.stringify(obj), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        })
        .on('error', (err) => {
            console.log(err);
        })
        .on('done', (err) => {
            if (err) {
                console.log(err);
            }
            if (__queue && __queue.length > 0) {
                convertFileQueue(__queue);
            }
        });
}