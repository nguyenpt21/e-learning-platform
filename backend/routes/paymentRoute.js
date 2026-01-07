import express from "express";
import { createOrder, completeOrder } from "../controllers/paypalController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  createVNPayPayment,
  vnpayReturn,
} from "../controllers/vnpayController.js";
const router = express.Router();

router.post("/paypal/create-order", protectRoute, createOrder);
router.post("/paypal/complete-order", protectRoute, completeOrder);
router.post("/vnpay/create", protectRoute, createVNPayPayment);
router.get("/vnpay/return", vnpayReturn);

export default router;
