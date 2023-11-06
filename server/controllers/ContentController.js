import fs from "fs";
import path from "path";

export const getContent = async (req, res) => {
    const url = './content/';
    // const url = '/var/www/jimikeurulainen/content/'; 
    try {
        const files = fs.readdirSync(url);
        const categories = [];
        console.log('files', files);

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