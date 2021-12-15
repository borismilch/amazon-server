import { Router } from "express";
import StripeController from "../controllers/StripeController.js";

const router = Router()

router.post('/checkout', StripeController.payOrDie)

router.post('/orders', StripeController.getOrders)

export default router