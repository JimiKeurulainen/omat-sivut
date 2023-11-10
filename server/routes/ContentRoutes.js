import express from "express";
import {
    getCategories, getFiles, getHTMLContent
} from "../controllers/ContentController.js";

const router = express.Router();
 
router.get('/', getCategories);
router.get('/:id/:id1', getFiles);
router.get('/file/:id', getHTMLContent);
 
export default router;