import { UnauthorizedException } from "@/common/utils/catch-errors";
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
      const secret = speakeasy.generateSecret({ name: "Squeezy" });
      secretKey = secret.base32;
      user.userPreferences.twoFactorSecret = secretKey;
      await user.save();
    }

    const url = speakeasy.otpauthURL({
      secret: secretKey,
      label: `${user.name}`,
      issuer: "squeezy.com",
      encoding: "base32",
    });

    const qrImageUrl = await qrcode.toDataURL(url);
    return { message: "Scan the QR code or use the setup key", secret: secretKey, qrImageUrl };
  }
}
