import { AuthController } from "@/modules/auth/auth.controller";
import { AuthService } from "@/modules/auth/auth.service";

const authService = new AuthService();
const authController = new AuthController(authService);

export { authController, authService };
