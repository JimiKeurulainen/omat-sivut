import fs from "fs";
import path from "path";
import * as deepl from 'deepl-node';
import { files } from "../index.js";

export const getRoutes = async (req, res) => {
    const url = path.join(process.env.CONTENT_PATH);
    const encoding = 'utf8';
    try {
        const content = fs.readdirSync(url, {encoding: encoding, recursive: true, withFileTypes: true});
        const routes = {};

        const handleName = (string) => {
            const nameArr = string.split('_');
            nameArr.length > 1 && nameArr.splice(0, 1);
            const name = nameArr.join('_');

            return name;
        }

        for (const dirent of content) {            
            const tempArr = dirent.parentPath.split('\\');
            tempArr.forEach((path, index) => {
                tempArr[index] = handleName(path);
            })
            const level = tempArr.length - 3;

            const name = handleName(dirent.name);
            const parent = tempArr[tempArr.length - 1];
            const grandparent = tempArr[tempArr.length - 2];
            const greatgrandparent = tempArr[tempArr.length - 3];

            if (level === 1 && dirent.name !== 'models') {
                routes[name] = {}
            }
            else if (level === 2 && tempArr.includes(parent)) {
                routes[parent][name] = {};
            }
            else if (level === 3 && tempArr.includes(parent)) {
                routes[grandparent][parent][name] = [];
            }
            else if (level === 4 && tempArr.includes(parent) && dirent.isDirectory()) {
                routes[greatgrandparent][grandparent][parent].push(name);
            }
            else if (dirent.isFile()) {
                let fileName = dirent.name.split('_');

                if (fileName.length > 1 && parseInt(fileName[0])) {
                    fileName = fileName.slice(1).join('_');
                }
                else {
                    fileName = dirent.name;
                }
                files[fileName ?? dirent.name] = (dirent.parentPath);
            }
        }

        res.send(routes);
    } catch (error) {
        console.error(error);
        res.json({ message: error.message });
    }   
}

export const getFile = async (req, res) => {
    const url = files[req.params.file];

    try {
        const dir = fs.readdirSync(url);
        console.log('PATH', url, dir);

        const images = [];
        var html = ''

        dir.forEach(file => {
            const nameArr = file.split(".");
            if (nameArr[nameArr.length - 1] !== 'html') {
                images.push(fs.readFileSync(path.join(url, file), {encoding: 'base64'}));
            } 
        });
        html = fs.readFileSync(path.join(url, dir[0]), {encoding: 'utf8'});

        res.setHeader('Content-Type', 'text/html');
        res.json({
            "data": html,
            "images": images
        });
    } catch (error) {
        res.json({ message: error.message });
    }   
}

export const getModel = async (req, res) => {
    const modelUrl = path.join('/var/www/jimikeurulainen/content/models/', `${req.params.model}.glb`);

    try {
		const modelSize = fs.statSync(modelUrl).size;
		const modelStream = fs.createReadStream(modelUrl, { highWaterMark: 1024 * 1024 });

        res.setHeader('Content-Type', 'model/gltf-binary');
        res.setHeader('Content-Disposition', `inline; filename=${req.params.model}.glb`);
        res.setHeader('Content-length', modelSize);
        
        modelStream.pipe(res);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getModelInfo = async (req, res) => {
    const infoUrl = path.join('/var/www/jimikeurulainen/content/models/', `${req.params.model}_${req.params.language}.json`);

    try {
		const info = fs.readFileSync(infoUrl);
        res.send(info);
    } catch (error) {
        res.json({ message: error.message });
    }   
}