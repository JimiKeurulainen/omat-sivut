import axios from "axios";


export const getStatus = async (req, res) => {
    try {
        console.log('getstatus');

        axios.get('http://localhost/server-status').then(status => {
            console.log('status', status);
            res.send(status);
        });
    } catch (error) {
        res.json({ message: error.message });
    }   
}