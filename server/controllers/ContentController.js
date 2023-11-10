import fs from "fs";
import path from "path";


export const getCategories = async (req, res) => {
    const url = '/var/www/jimikeurulainen/content/';
    try {
        const files = fs.readdirSync(url);
        const categories = [];

        files.forEach(dir => {
            const files = fs.readdirSync(url+dir);
            categories.push({[dir]: files});
        })
        console.log(categories);

        res.json({
            "data": categories
        })
    } catch (error) {
        res.json({ message: error.message });
    }   
}

export const getFiles = async (req, res) => {
    const url = path.join('/var/www/jimikeurulainen/content/', req.params.id, req.params.id1);

    try {
        const dir = fs.readdirSync(url);

        res.json({
            "data": dir
        })
    } catch (error) {
        res.json({ message: error.message });
    }   
}

export const getHTMLContent = async (req, res) => {
    const url = path.join('/var/www/jimikeurulainen/content/', req.params.id, req.params.id1);

    try {
        const file = fs.readFileSync(path.join(url, dir[0]), {encoding: 'utf8'});
        console.log('path', dir, file);

        res.setHeader('Content-Type', 'text/html');
        res.json({
            "data": file
        })
    } catch (error) {
        res.json({ message: error.message });
    }   
}