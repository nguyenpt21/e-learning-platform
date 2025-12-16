import express from "express";
import { createOrder , completeOrder } from "../controllers/paypalController.js"
import { protectRoute } from "../middleware/authMiddleware.js"
const router = express.Router();

router.post("/paypal/create-order", protectRoute, createOrder)
router.post("/paypal/complete-order", protectRoute, completeOrder)

export default router;