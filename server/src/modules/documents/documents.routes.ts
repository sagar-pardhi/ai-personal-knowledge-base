import { Router } from "express";

import { upload } from "../../config/multer.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import {
  getDocumentsHandler,
  uploadDocumentHandler,
} from "./documents.controller.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(uploadDocumentHandler),
);

router.get("/kb/:kbId", asyncHandler(getDocumentsHandler));

export default router;
