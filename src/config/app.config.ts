import { getEnv } from "@/common/utils/get-env";
import "dotenv/config";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV"),
  APP_ORIGIN: getEnv("APP_ORIGIN"),
  PORT: getEnv("PORT"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  MONGO_URI: getEnv("MONGO_URI"),
  JWT: {
    SECRET: getEnv("JWT_SECRET"),
    EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),
    REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
    REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN"),
  },
  MAILER_SENDER: getEnv("MAILER_SENDER"),
  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
});

export const config = appConfig();
