import express from "express";
import {
    getContent, getHTMLContent
} from "../controllers/ContentController.js";

const router = express.Router();
 
router.get('/', getContent);
router.get('/:id/:id1', getHTMLContent);
 
export default router;