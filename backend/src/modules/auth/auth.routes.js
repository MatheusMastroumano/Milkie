import express from 'express';
import * as authController from './auth.controller.js';

const router = express.Router();

router.post('/login', authController.loginController);
router.post('/logout', authController.logoutController);
router.get('/check-auth', authController.checkAuthController);

export default router;