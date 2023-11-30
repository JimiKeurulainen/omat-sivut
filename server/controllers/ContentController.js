import fs from "fs";
import path from "path";


export const getRoutes = async (req, res) => {
    const url = path.join('/var/www/jimikeurulainen/content/', req.params.language, '/');
    const encoding = 'utf8';
    try {
        const categories = fs.readdirSync(url, {encoding: encoding});
        categories.splice(categories.indexOf('models'), 1);

        const routes = categories.map(category => {
            const subcategories = fs.readdirSync(url + category, {encoding: encoding});
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

export const getFileEN = async (req, res) => {
    const url = path.join('/var/www/jimikeurulainen/content/', req.params.category, req.params.subcategory, req.params.file);

    try {
        const dir = fs.readdirSync(url);
        const images = [];
        let isEN = false;
        let html = '';
        
        dir.forEach(file => {
            const nameArr = file.split(".");
            if (nameArr[nameArr.length - 1] !== 'html') {
                images.push(fs.readFileSync(path.join(url, file), {encoding: 'base64'}));
            }
            
            const parseEN = nameArr[nameArr.length - 2].split("_");
            console.log('parseEN', parseEN);
            parseEN[parseEN.length - 1] === 'EN' && (isEN = true);
        });
        if (isEN) {
            console.log('is EN' );
            // html = fs.readFileSync(path.join(url, `${req.params.file}_EN.html`), {encoding: 'utf8'})
        }
        else {
            console.log('not EN');
            // html = fs.readFileSync(path.join(url, `${req.params.file}.html`), {encoding: 'utf8'});
            // const resHtml = getFromDeepL(html);
            // fs.writeFileSync(path.join(url, `${req.params.file}_EN.html`), resHtml);
        }

        res.setHeader('Content-Type', 'text/html');
        res.json({
            "data": html,
            "images": images
        })
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
    const infoUrl = path.join('/var/www/jimikeurulainen/content/models/', `${req.params.model}.json`);

    try {
		const info = fs.readFileSync(infoUrl);
        res.send(info);
    } catch (error) {
        res.json({ message: error.message });
    }   
}