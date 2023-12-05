import fs from "fs";
import path from "path";


export const getRoutes = async (req, res) => {
    const url = path.join('/var/www/jimikeurulainen/content/');
    const encoding = 'utf8';
    try {
        const content = fs.readdirSync(url, {encoding: encoding});
        content.splice(content.indexOf('models'), 1);

        const routes = content.map(locale => {
            const categories = fs.readdirSync(path.join(url, locale), {encoding: encoding});
            console.log('categories', categories, locale);

            const palaute = categories.map(category => {
                const subcategories = fs.readdirSync(path.join(url, locale, category));
                console.log('subcategories', subcategories);

                return {[category]: subcategories.map(subcategory => {
                    if (subcategory) {
                        return {[subcategory]: fs.readdirSync(path.join(url, locale, category, subcategory))}
                    }
                    else {
                        return [];
                    }
                })}
            });
            return {[locale]: palaute};
        });
        console.log('routes', routes);

        res.send(routes);
    } catch (error) {
        res.json({ message: error.message });
    }   
}

export const getFile = async (req, res) => {
    const url = path.join('/var/www/jimikeurulainen/content/', req.params.language, req.params.category, req.params.subcategory, req.params.file);

    try {
        const dir = fs.readdirSync(url);
        const images = [];
        var html = ''

        if (req.params.language === 'EN') {
            if (dir.length === 0) {
                const dirFI = fs.readdirSync('/var/www/jimikeurulainen/content/FI/');
                console.log('hakee EN tyhjä', url, dir, dirFI);
                dirFI.forEach(category => {
                    if (category.split('_')[0] === req.params.category.split('_')[0]) {
                        console.log('')
                    }
                });
                // const categoryInFI = dirFI.indexOf(req.params.category.split(''))
                // const pathFromFI = path.join('FI', req.params.category.split()) 
            }
        }
        else {
            dir.forEach(file => {
                const nameArr = file.split(".");
                if (nameArr[nameArr.length - 1] !== 'html') {
                    images.push(fs.readFileSync(path.join(url, file), {encoding: 'base64'}));
                } 
            });
            html = fs.readFileSync(path.join(url, `${req.params.file}.html`), {encoding: 'utf8'});
        }

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
    const infoUrl = path.join('/var/www/jimikeurulainen/content/models/', `${req.params.model}.json`);

    try {
		const info = fs.readFileSync(infoUrl);
        res.send(info);
    } catch (error) {
        res.json({ message: error.message });
    }   
}