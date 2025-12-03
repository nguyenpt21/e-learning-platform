import express from "express";
import { conversionComplete } from "../controllers/webhookController.js";
import { handleCaptionWebhook } from "../controllers/courseController.js";

const router = express.Router();

router.post("/conversion-complete", conversionComplete);
router.post("/transcription", handleCaptionWebhook);

export default router;
