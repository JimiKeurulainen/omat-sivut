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
        const file = fs.readFileSync(path.join(url, `${req.params.file}.html`), {encoding: 'utf8'});
        console.log('path', file);

        res.setHeader('Content-Type', 'text/html');
        res.json({
            "data": file
        })
    } catch (error) {
        res.json({ message: error.message });
    }   
}