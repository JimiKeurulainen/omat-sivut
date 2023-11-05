import express from "express";
import {
    getContent
} from "../controllers/ContentController.js";

const router = express.Router();
 
router.get('/', getContent);
 
export default router;