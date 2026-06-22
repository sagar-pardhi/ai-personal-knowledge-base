import multer from "multer";

const allowedMimeTypes = ["application/pdf", "text/plain", "text/markdown"];

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF, TXT and Markdown files are allowed"));
    }

    cb(null, true);
  },
});
