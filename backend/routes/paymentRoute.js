import express from "express";
import { createOrder , completeOrder } from "../controllers/paypalController.js"
const router = express.Router();

router.post("/paypal/create-order", createOrder)
router.post("/paypal/complete-order", completeOrder)

export default router;