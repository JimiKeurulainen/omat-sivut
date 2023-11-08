import fs from "fs";


export const getContent = async (req, res) => {
    const url = './content/';
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