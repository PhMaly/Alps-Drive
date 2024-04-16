const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");


function start() {
    const express = require('express');
    const app = express();
    const port = 3000;
    const racinePath = path.join(os.tmpdir(), 'newFolder')


    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(port, () => {
        console.log('Got it !');
    });

    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
    });


    async function showFolder(drivePath) {
        const arrayResponse = [];

        const files = await fs.promises.readdir(drivePath, {withFileTypes: true})
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
        return arrayResponse
    }

    app.get('/api/drive', async (req, res) => {

        const files = await showFolder(racinePath)
        return res.status(200).send(files)

    });


    app.get('/api/drive/:name', async (req, res) => {
        const name = req.params.name;
        const stats = await fs.promises.stat(path.join(racinePath, name));

        try {
            if (stats.isDirectory()) {

                const files = await showFolder(path.join(racinePath, name))

                res.status(200).send(files)

            } else {
                res.sendFile(path.join(racinePath, name))
            }
        } catch (error) {
            res.status(404).send('Not Found')
        }
    });

    app.post(`/api/drive/`, async (req, res) => {
        const name = req.query.name;
        const myRegex = /^[a-zA-Z]+$/;

        try {
            if (myRegex.test(name) === false) {
                res.status(400).send('Ne dois comporter que des lettres et des tirets')
            } else {
                const folder = path.join(racinePath, name)
                await fs.promises.mkdir(folder);
                return res.sendStatus(201);
            }
        } catch (error) {
            return res.status(500).send(`Cannot create the folder: ${error}`);
        }

    });

    app.post(`/api/drive/:folder`, async (req, res) => {
        const folder = req.params.folder;
        const name = req.query.name;
        const myRegex = /^[a-zA-Z]+$/;

        try {
            if (myRegex.test(name) === false) {
                res.status(400).send('Ne dois comporter que des lettres et des tirets')
            } else {
                const pathFolder = path.join(racinePath, folder, name);
                await fs.promises.mkdir(pathFolder);
                return res.sendStatus(201);
            }
        } catch (error) {
            return res.status(404).send(`${error} n'existe pas`);
        }

    });

    app.delete(`/api/drive/:name`, async (req, res) => {
        const name = req.params.name
        const myRegex = /^[a-zA-Z]+$/;

        if (myRegex.test(name)) {
            if (myRegex.test(name) === false) {
                res.status(400).send('Ne dois comporter que des lettres et des tirets')
            } else {
                await fs.promises.rmdir(path.join(racinePath, name))
                return res.sendStatus(200);
            }
        }
    });

}

module.exports = start;
