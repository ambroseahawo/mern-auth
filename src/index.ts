require("module-alias/register");

import { config } from "@/config/app.config";
import { HTTPSTATUS } from "@/config/http.config";
import connectDatabase from "@/database";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { errorHandler } from "@/middlewares/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.APP_ORIGIN, credentials: true }));
app.use(cookieParser());

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({ message: "mern auth" });
  }),
);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
