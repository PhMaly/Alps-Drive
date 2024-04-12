const fs = require("node:fs");

function start() {
    const express = require('express');
    const app = express();
    const port = 3000;

    app.get('/', (req, res) => {
        res.send('Hello World!');
    })

    app.listen(port, () => {
        console.log('Got it !');
    })

    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
    })


    function getFolder() {
        app.get('/api/drive', async (req, res) => {
            const files = await fs.promises.readdir('./', {withFileTypes: true});
            const filesFormat = files.map(file => {
                return obj = {
                    name: file.name,
                    isFolder: file.isDirectory(),
                }
            })


            res.send(filesFormat)

        });
    }
    getFolder();

}

module.exports = start;
