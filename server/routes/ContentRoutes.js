import express from "express";
import {
    getRoutes, getFile
} from "../controllers/ContentController.js";

const router = express.Router();
 
router.get('/routes', getRoutes);
router.get('/:category/:subcategory/:file', getFile);
 
export default router;