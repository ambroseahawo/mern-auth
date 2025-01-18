import { BadRequestException, UnauthorizedException } from "@/common/utils/catch-errors";
import { Request } from "express";
import qrcode from "qrcode";
import speakeasy from "speakeasy";

export class MfaService {
  public async generateMFASetup(req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("User not authorized");
    }

    if (user.userPreferences.enable2FA) {
      return { message: "MFA already enabled" };
    }

    let secretKey = user.userPreferences.twoFactorSecret;
    if (!secretKey) {
      const secret = speakeasy.generateSecret({ name: "MernAuth" });
      secretKey = secret.base32;
      user.userPreferences.twoFactorSecret = secretKey;
      await user.save();
    }

    const url = speakeasy.otpauthURL({
      secret: secretKey,
      label: `${user.name}`,
      issuer: "mernauth.com",
      encoding: "base32",
    });

    const qrImageUrl = await qrcode.toDataURL(url);
    return { message: "Scan the QR code or use the setup key", secret: secretKey, qrImageUrl };
  }

  public async verifyMFASetup(req: Request, code: string, secretKey: string) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException("User not authorized");
    }

    if (user.userPreferences.enable2FA) {
      return {
        message: "MFA already enabled",
        userPreferences: { enable2FA: user.userPreferences.enable2FA },
      };
    }

    const isValid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      throw new BadRequestException("Invalid MFA code. Please try again");
    }

    user.userPreferences.enable2FA = true;
    await user.save();

    return {
      message: "MFA setup completed successfully",
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA,
      },
    };
  }
}
