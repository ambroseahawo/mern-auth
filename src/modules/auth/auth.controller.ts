import { UnauthorizedException } from "@/common/utils/catch-errors";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthenticationCookies,
} from "@/common/utils/cookie";
import {
  loginSchema,
  registerSchema,
  verificationEmailSchema,
} from "@/common/validators/auth.validator";
import { HTTPSTATUS } from "@/config/http.config";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { AuthService } from "@/modules/auth/auth.service";
import { Request, Response } from "express";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const body = registerSchema.parse({ ...req.body });
    const { user } = await this.authService.register(body);

    return res.status(HTTPSTATUS.CREATED).json({ message: "User registered successfully", data: user });
  });

  public login = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userAgent = req.headers["user-agent"];
    const body = loginSchema.parse({ ...req.body, userAgent });

    const { user, accessToken, refreshToken, mfaRequired } = await this.authService.login(body);
    if (mfaRequired) {
      return res.status(HTTPSTATUS.OK).json({
        message: "Verify MFA authentication",
        mfaRequired,
        user,
      });
    }

    return setAuthenticationCookies({
      res,
      accessToken,
      refreshToken,
    })
      .status(HTTPSTATUS.OK)
      .json({
        message: "User logged in successfully",
        mfaRequired,
        user,
      });
  });

  public refreshToken = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException("Missing refresh token");
    }

    const { accessToken, newRefreshToken } = await this.authService.refreshToken(refreshToken);
    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    }

    return res
      .status(HTTPSTATUS.OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({ message: "Refresh access token successfully" });
  });

  public verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { code } = verificationEmailSchema.parse(req.body);
    await this.authService.verifyEmail(code);

    return res.status(HTTPSTATUS.OK).json({ message: "Email verified successfully" });
  });
}
