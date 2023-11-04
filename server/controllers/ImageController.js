import fs from "fs";
import path from "path";

export const getImages = async (req, res) => {
    const url = path.join('/var/www/html/server/images/products/', req.params.id); 
    try {
        const files = fs.readdirSync(url);
        const images = [];
        console.log('files', files);

        files.forEach(element => {
            const file = fs.readFileSync(path.join(url, element), {encoding: 'base64'});
            const name = element.split('.')[0];
            images.push([name, file]);
        })

        res.json({
            "data": images
        })
    } catch (error) {
        res.json({ message: error.message });
    }   
}