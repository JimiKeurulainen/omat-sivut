import express from "express";
import {
    getRoutes, getFile, getModel, getModelInfo
} from "../controllers/ContentController.js";

const router = express.Router();
 
router.get('/routes', getRoutes);
router.get('/files/:file', getFile);
router.get('/models/:model', getModel);
router.get('/modelsInfo/:language/:model', getModelInfo);
 
export default router;