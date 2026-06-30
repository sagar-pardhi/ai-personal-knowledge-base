import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanMarkdown(text: string) {
  if (!text) return "";
  return text.replace(/^```(?:markdown)?\s*\n/i, "").replace(/\n```$/, "");
}
