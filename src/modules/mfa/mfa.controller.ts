import { setAuthenticationCookies } from "@/common/utils/cookie";
import { verifyMfaForLoginSchema, verifyMfaSchema } from "@/common/validators/mfa.validators";
import { HTTPSTATUS } from "@/config/http.config";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { MfaService } from "@/modules/mfa/mfa.service";
import { Request, Response } from "express";

export class MfaController {
  private mfaService: MfaService;

  constructor(mfaService: MfaService) {
    this.mfaService = mfaService;
  }

  public generateMFAsETUP = asyncHandler(async (req: Request, res: Response) => {
    const { secret, qrImageUrl, message } = await this.mfaService.generateMFASetup(req);

    return res.status(HTTPSTATUS.OK).json({
      message,
      secret,
      qrImageUrl,
    });
  });

  public verifyMFASetup = asyncHandler(async (req: Request, res: Response) => {
    const { code, secretKey } = verifyMfaSchema.parse({ ...req.body });
    const { userPreferences, message } = await this.mfaService.verifyMFASetup(req, code, secretKey);

    return res.status(HTTPSTATUS.OK).json({
      message,
      userPreferences,
    });
  });

  public revokeMFA = asyncHandler(async (req: Request, res: Response) => {
    const { message, userPreferences } = await this.mfaService.revokeMFA(req);
    return res.status(HTTPSTATUS.OK).json({
      message,
      userPreferences,
    });
  });

  public verifyMFAForLogin = asyncHandler(async (req: Request, res: Response) => {
    const { code, email, userAgent } = verifyMfaForLoginSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });

    const { accessToken, refreshToken, user } = await this.mfaService.verifyMFAForLogin(
      code,
      email,
      userAgent,
    );

    return setAuthenticationCookies({
      res,
      accessToken,
      refreshToken,
    })
      .status(HTTPSTATUS.OK)
      .json({ message: "Verified and logged in successfully", user });
  });
}
