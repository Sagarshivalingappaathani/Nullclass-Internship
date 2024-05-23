import express from "express";
import { saveLoginInfo } from "../controllers/logininfo.js";


const router = express.Router();

router.post("/saveinfo", saveLoginInfo);

export default router;
