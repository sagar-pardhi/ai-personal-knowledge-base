export function cleanText(text: string) {
  return text
    .replace(/\0/g, "")
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
