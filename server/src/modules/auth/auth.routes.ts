import { Router } from "express";

import { loginHandler, meHandler, registerHandler } from "./auth.controller.js";

import { loginSchema, registerSchema } from "./auth.schema.js";

import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(registerHandler),
);

router.post("/login", validate(loginSchema), asyncHandler(loginHandler));

router.get("/me", authMiddleware, asyncHandler(meHandler));

export default router;
