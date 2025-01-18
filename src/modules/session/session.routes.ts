import { sessionController } from "@/modules/session/session.module";
import { Router } from "express";

const sessionRoutes = Router();

sessionRoutes.get("/all", sessionController.getAllSession);
sessionRoutes.get("/", sessionController.getSessionById);
sessionRoutes.delete("/:id", sessionController.deleteSession);

export default sessionRoutes;
