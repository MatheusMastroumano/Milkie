import express from 'express';
import * as authController from './auth.controller.js';
import authMiddleware from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.loginController);
router.post('/logout', authController.logoutController);
router.get('/check-auth', authController.checkAuthController);
router.post('/change-password', authMiddleware, authController.changePasswordController);

export default router;