import { authController } from "@/modules/auth/auth.module";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/verify-email", authController.verifyEmail);
authRoutes.post("/password-forgot", authController.forgotPassword);
authRoutes.post("/password-reset", authController.resetPassword);
authRoutes.post("/logout", authController.logout);

export default authRoutes;
