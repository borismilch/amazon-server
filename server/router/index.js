import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { body } from "express-validator";
import authMiddleware from '../middleware/authMiddleware.js'


const router = Router()

router.post('/registration', body('email').isEmail(), body('password').isLength({ min: 5, max: 32 }), UserController.register)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/activate/:link', UserController.activate)
router.get('/refresh', UserController.refresh)
router.get('/users', authMiddleware, UserController.getUsers)

export default router