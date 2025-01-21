import { setUpJwtStrategy } from "@/common/strategies/jwt.strategy";
import passport from "passport";

const initializePassport = () => {
  setUpJwtStrategy(passport);
};

initializePassport();
export default passport;
