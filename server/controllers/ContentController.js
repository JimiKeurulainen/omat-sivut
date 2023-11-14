import fs from "fs";
import path from "path";


function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str.replaceAll('ä', '\xe4');
}

export const getRoutes = async (req, res) => {
    const url = '/var/www/jimikeurulainen/content/';
    const encoding = 'hex';
    try {
        const categories = fs.readdirSync(url, {encoding: encoding});

        const routes = categories.map(category => {
            const subcategories = fs.readdirSync(url + hex2a(category), {encoding: encoding});
            const palaute = subcategories.map(subcategory => {
                console.log('file', subcategory, "'" + hex2a(subcategory) + "'");
                if (subcategory) {
                    return {[subcategory]: fs.readdirSync(url + hex2a(category) + '/' + "'" + hex2a(subcategory) + "'")}
                }
                else {
                    return [];
                }
            })
            console.log('palaute', {[category]: palaute})
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
            console.log('file', file, file.normalize('NFC'));
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