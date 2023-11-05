import fs from "fs";
import path from "path";

export const getContent = async (req, res) => {
    const url = './content/';
    // const url = '/var/www/jimikeurulainen/content/'; 
    try {
        const files = fs.readdirSync(url);
        const categories = [];
        console.log('files', files);

        // files.forEach(element => {
        //     const file = fs.readFileSync(path.join(url, element), {encoding: 'base64'});
        //     const name = element.split('.')[0];
        //     categories.push([name, file]);
        // })

        res.json({
            "data": files
        })
    } catch (error) {
        res.json({ message: error.message });
    }   
}