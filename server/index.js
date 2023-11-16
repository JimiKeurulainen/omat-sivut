import express from "express";
import contentRoutes from "./routes/ContentRoutes.js";
import https from "https";
import http from "http";
import cors from "cors";
import fs from "fs";
import busboy from "connect-busboy";

const app = express();

app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "jimikeurulainen.site");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());
app.use(express.json());
app.use(busboy({
    highWaterMark: 10 * 1024 * 1024, // Set 10MiB buffer
})); // Insert the busboy middle-ware

app.use('/content', contentRoutes);

http.createServer(app).listen(5555, () => console.log('Server running at port 5555'));
