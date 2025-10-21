import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomNodeKey(val?: string) {
  const randomId = `${Date.now()}-${Math.random().toString(36)}`;
  return val ? `${randomId}-${val}` : randomId;
}
