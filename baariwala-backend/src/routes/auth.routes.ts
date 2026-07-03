import { Router } from 'express';
import { signup, login, googleLogin, refresh, forgotPassword, resetPassword, sendOtp, verifyOtp } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authSchemas } from '../validators/auth.validator';

const router = Router();

router.post('/signup', validate(authSchemas.signup), signup);
router.post('/login', validate(authSchemas.login), login);
router.post('/otp/send', validate(authSchemas.sendOtp), sendOtp);
router.post('/otp/verify', validate(authSchemas.verifyOtp), verifyOtp);
router.post('/google', validate(authSchemas.googleLogin), googleLogin);
router.post('/refresh', refresh);
router.post('/forgot-password', validate(authSchemas.forgotPassword), forgotPassword);
router.post('/reset-password', validate(authSchemas.resetPassword), resetPassword);

export default router;
