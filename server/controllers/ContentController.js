import fs from "fs";
import path from "path";


export const getRoutes = async (req, res) => {
    const url = '/var/www/jimikeurulainen/content/';
    try {
        const categories = fs.readdirSync(url);

        const routes = categories.map(category => {
            const subcategories = fs.readdirSync(url + category);
            const palaute = subcategories.map(subcategory => {
                if (subcategory) {
                    return {[subcategory]: fs.readdirSync(url + category + '/' + subcategory)}
                }
                else {
                    return [];
                }
            })
            return {[category]: palaute};
        });
        res.send(routes);
    } catch (error) {
        res.json({ message: error.message });
    }   
}

export const getFile = async (req, res) => {
    const url = path.join('/var/www/jimikeurulainen/content/', req.params.category, req.params.subcategory, req.params.file);

    try {
        const dir = fs.readdirSync(url);
        const images = [];
        dir.forEach(file => {
            console.log('file', file);
            const nameArr = file.split(".");
            if (nameArr[nameArr.length - 1] !== 'html') {
                images.push(fs.readFileSync(path.join(url, file), {encoding: 'base64'}));
            } 
        })
        const html = fs.readFileSync(path.join(url, `${req.params.file}.html`), {encoding: 'utf8'});

        res.setHeader('Content-Type', 'text/html');
        res.json({
            "data": html,
            "images": images
        })
    } catch (error) {
        res.json({ message: error.message });
    }   
}