import { NextFunction, Request, Response } from "express";

type AsynControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler =
  (controller: AsynControllerType): AsynControllerType =>
  async (req, resizeBy, next) => {
    try {
      await controller(req, resizeBy, next);
    } catch (error) {
      next(error);
    }
  };
