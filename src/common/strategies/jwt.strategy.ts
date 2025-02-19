import { ErrorCode } from "@/common/enums/error-code.enum";
import { UnauthorizedException } from "@/common/utils/catch-errors";
import { config } from "@/config/app.config";
import { userService } from "@/modules/user/user.module";
import passport, { PassportStatic } from "passport";
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptionsWithRequest } from "passport-jwt";

interface JwtPayload {
  userId: string;
  sessionId: string;
}

const options: StrategyOptionsWithRequest = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        throw new UnauthorizedException("Unauthorized access token", ErrorCode.AUTH_TOKEN_NOT_FOUND);
      }

      return accessToken;
    },
  ]),
  secretOrKey: config.JWT.SECRET,
  audience: ["user"],
  algorithms: ["HS256"],
  passReqToCallback: true,
};

export const setUpJwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(options, async (req, payload: JwtPayload, done) => {
      try {
        const user = await userService.findUserById(payload.userId);
        if (!user) {
          return done(null, false);
        }

        req.sessionId = payload.sessionId;
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }),
  );
};

export const authenticateJWT = passport.authenticate("jwt", { session: false });
