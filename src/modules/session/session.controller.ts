import { NotFoundException } from "@/common/utils/catch-errors";
import { HTTPSTATUS } from "@/config/http.config";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { SessionService } from "@/modules/session/session.service";
import { Request, Response } from "express";
import { z } from "zod";

export class SessionController {
  private sessionService: SessionService;

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  public getAllSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const sessionId = req.sessionId;

    const { sessions } = await this.sessionService.getAllSession(userId);

    const modifySessions = sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === sessionId && {
        isCurrent: true,
      }),
    }));

    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Retrieved all session successfully", sessions: modifySessions });
  });

  public getSessionById = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req?.sessionId;

    if (!sessionId) {
      throw new NotFoundException("SessionID not found. Please log in");
    }

    const { user } = await this.sessionService.getSessionById(sessionId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Session retrieved successfully",
      user,
    });
  });

  public deleteSession = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = z.string().parse(req.params.id);
    const userId = req.user?.id;

    await this.sessionService.deleteSession(sessionId, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Session deleted successfully",
    });
  });
}
