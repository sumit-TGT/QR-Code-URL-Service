import express from "express";
import { generateQR, redirectLink, linkStats } from "../controllers/qrController.js";

const router = express.Router();

router.post("/generate", generateQR);
router.get("/r/:token", redirectLink);
router.get("/stats/:token", linkStats);

export default router;
