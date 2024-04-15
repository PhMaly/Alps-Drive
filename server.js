const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");


function start() {
    const express = require('express');
    const app = express();
    const port = 3000;
    const racinePath = path.join(os.tmpdir(), 'newFolder')
    console.log(racinePath)

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


    async function showFolder(res) {
        try {
            const arrayResponse = [];

            const files = await fs.promises.readdir(racinePath, {withFileTypes: true})
            for (const file of files) {
                const stats = await fs.promises.stat(path.join(file.path, file.name));
                let objTemp = {};
                objTemp = {
                    name: file.name,
                    isFolder: file.isDirectory(),
                    size: stats.size
                }
                arrayResponse.push(objTemp)
            }
            return res.status(200).send(arrayResponse)

        } catch (error) {
            return res.status(404).send('Not found')
        }
    }

    app.get('/api/drive',(req, res) => {
         showFolder(res)
    })


    

}

module.exports = start;
