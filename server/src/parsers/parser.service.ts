import { parsePdf } from "./pdf.parser.js";
import { parseText } from "./text.parser.js";

export async function parseDocument(fileType: string, buffer: Buffer) {
  switch (fileType) {
    case "application/pdf":
      return parsePdf(buffer);

    case "text/plain":
      return parseText(buffer);

    case "text/markdown":
      return parseText(buffer);

    default:
      throw new Error("Unsupported file type");
  }
}
