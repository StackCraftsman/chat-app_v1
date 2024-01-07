import { Router } from "express";
import { emailRegister, phoneRegister, resend_phone_2FA, verify_phone_login_2FA, auth_passport, passport_callback, resend_2FA, verify_2FA} from '../controllers/user.js';

import dotenv  from 'dotenv';

dotenv.config(); 



const user_router = Router();


user_router.post('/email-register', emailRegister);
user_router.post('/phone-register', phoneRegister);
user_router.get('/resend-phone-otp', resend_phone_2FA);
user_router.post('/verify-phone', verify_phone_login_2FA);
user_router.get('/resend-email-otp', resend_2FA);
user_router.post('/verify-email-2fa', verify_2FA);

/**====== Google login ===== */
user_router.get('/auth-google', auth_passport.authenticate("google", { scope: ["profile"] }));
user_router.get("/auth/google-redirect", auth_passport.authenticate("google", { failureRedirect: "/login" }), passport_callback);

user_router.get('/secrets', )
export default user_router;
