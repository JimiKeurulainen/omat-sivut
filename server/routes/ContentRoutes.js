import express from "express";
import {
    getRoutes, getFile, getModel, getModelInfo, getFileEN
} from "../controllers/ContentController.js";

const router = express.Router();
 
router.get('/routes/:language', getRoutes);
router.get('/:category/:subcategory/:file', getFile);
router.get('/en/:category/:subcategory/:file', getFileEN);
router.get('/models/:model', getModel);
router.get('/modelsInfo/:model', getModelInfo);
 
export default router;