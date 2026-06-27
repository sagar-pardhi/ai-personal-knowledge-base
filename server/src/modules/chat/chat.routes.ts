import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { chatHandler, streamChatHandler } from "./chat.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/search",

  asyncHandler(chatHandler),
);

router.post(
  "/stream",

  asyncHandler(streamChatHandler),
);

export default router;
