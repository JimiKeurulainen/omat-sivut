import express from "express";
import {
    getImages
} from "../controllers/ImageController.js";

const router = express.Router();
 
router.get('/:id', getImages);
 
export default router;