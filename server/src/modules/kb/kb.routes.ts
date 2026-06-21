import { Router } from "express";

import {
  createKbHandler,
  deleteKbHandler,
  getKbHandler,
  getKbsHandler,
  updateKbHandler,
} from "./kb.controller.js";

import { createKbSchema, updateKbSchema } from "./kb.schema.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createKbSchema), asyncHandler(createKbHandler));

router.get("/", asyncHandler(getKbsHandler));

router.get("/:id", asyncHandler(getKbHandler));

router.patch("/:id", validate(updateKbSchema), asyncHandler(updateKbHandler));

router.delete("/:id", asyncHandler(deleteKbHandler));

export default router;
