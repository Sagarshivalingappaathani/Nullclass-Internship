import express from "express";
import {frenchlang,notfrenchlang} from "../controllers/Langchange.js";

const router = express.Router();

router.post("/fr", frenchlang);
router.post("/not-fr", notfrenchlang);

export default router;
