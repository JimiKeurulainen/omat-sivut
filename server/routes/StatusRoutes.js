import express from "express";
import {
    getStatus,
} from "../controllers/StatusController.js";

const router = express.Router();
 
router.get('/', getStatus);
 
export default router;