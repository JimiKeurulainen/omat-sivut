import express from "express";
import contentRoutes from "./routes/ContentRoutes.js";
import https from "https";
import http from "http";
import cors from "cors";
import fs from "fs";
import busboy from "connect-busboy";

// const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
// const privateKey  = fs.readFileSync(config.SSHKEY);
// const certificate = fs.readFileSync(config.SSHCERT);
// const credentials = {key: privateKey, cert: certificate};

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "jimikeurulainen.site");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());
app.use(express.json());
app.use(busboy({
    highWaterMark: 10 * 1024 * 1024, // Set 10MiB buffer
})); // Insert the busboy middle-ware

app.use('/content', contentRoutes);

http.createServer(app).listen(5000, () => console.log('Server running at port 5000'));
// https.createServer(credentials, app).listen(5001, () => console.log('Server running at port 5001'));