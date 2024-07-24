import fs from "fs";
import path from "path";
import * as deepl from 'deepl-node';


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
            console.log('LEVEL', level, tempArr, parent);


            if (level === 1 && dirent.name !== 'models') {
                routes[name] = {}
            }
            else if (level === 2 && tempArr.includes(parent)) {
                routes[parent][name] = {};
                console.log('2', parent, name);
            }
            else if (level === 3 && tempArr.includes(parent)) {
                console.log('3', parent, name, grandparent);
                routes[grandparent][parent][name] = [];
            }
            else if (level === 4 && tempArr.includes(parent) && dirent.isDirectory()) {
                console.log('4', parent, name);
                routes[greatgrandparent][grandparent][parent].push(name);
            }
        }
        console.log('ROUTES', routes);

        res.send(routes);
    } catch (error) {
        console.error(error);
        res.json({ message: error.message });
    }   
}

export const getFile = async (req, res) => {
    const url = path.join('/var/www/jimikeurulainen/content/', req.params.language, req.params.category, req.params.subcategory, req.params.file);

    try {
        const dir = fs.readdirSync(url);
        const images = [];
        var html = ''

        if (req.params.language === 'EN' && dir.length === 0) {
            // If there is no already translated file on the server
            const dirFI = fs.readdirSync('/var/www/jimikeurulainen/content/FI/');
            const auth = fs.readFileSync('/var/www/jimikeurulainen/auth/auth.json', {encoding: 'utf8'});
            const translator = new deepl.Translator(JSON.parse(auth).deepL);
            var filePath = '';

            dirFI.forEach(category => {
                if (category.split('_')[0] === req.params.category.split('_')[0]) {
                    const subcategories = fs.readdirSync(path.join('/var/www/jimikeurulainen/content/FI/', category));
                    subcategories.forEach(subcategory => {
                        if (subcategory.split('_')[0] === req.params.subcategory.split('_')[0]) {
                            const files = fs.readdirSync(path.join('/var/www/jimikeurulainen/content/FI/', category, subcategory));
                            files.forEach(file => {
                                if (file.split('_')[0] === req.params.file.split('_')[0]) {
                                    filePath = path.join('/var/www/jimikeurulainen/content/FI/', category, subcategory, file, `${file}.html`);
                                }
                            });
                        }
                    });
                }
            });

            filePath !== '' && translator.translateDocument(
                filePath,
                path.join(url, `${req.params.file}.html`),
                'fi',
                'en-GB'
            ).then(res => {
                console.log('res', res, res.text)
            })
        }
        // else if () {
        //     // If a translated file already exists
        //     html = fs.readFileSync(path.join(url, `${req.params.file}.html`), {encoding: 'utf8'});
        // }
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
    const infoUrl = path.join('/var/www/jimikeurulainen/content/models/', `${req.params.model}_${req.params.language}.json`);

    try {
		const info = fs.readFileSync(infoUrl);
        res.send(info);
    } catch (error) {
        res.json({ message: error.message });
    }   
}