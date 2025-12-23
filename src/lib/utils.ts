import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomNodeKey(val?: string): string {
  const randomId = `${Date.now()}-${Math.random().toString(36)}`;
  return val ? `${randomId}-${val}` : randomId;
}

export function getAccessToken(): string {
  return localStorage.getItem("access_token") || "";
}

export function devLog(...args: unknown[]): void {
  if (process.env.NODE_ENV === "development") console.log(...args);
}

export function jsonLog(arg1: unknown, arg2?: unknown): void {
  if (process.env.NODE_ENV !== "development") return;
  if (arg2 === undefined) {
    console.log(`[\n${JSON.stringify(arg1, null, 2)}\n]`);
  } else {
    console.log(`${arg1}\n[\n${JSON.stringify(arg2, null, 2)}\n]`);
  }
}

export function devOut<T>(inputs: T): T | undefined {
  if (process.env.NODE_ENV === "development") return inputs;
}

export function logApiError(...args: unknown[]): void {
  if (process.env.NODE_ENV !== "development") return;

  if (args.length === 0) return;
  const error = args.pop();

  if (args.length > 0) {
    console.error(...args);
  }
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (detail) {
      console.error("API Detail:", detail);
    } else if (error.response) {
      console.error("API Status:", error.response.status, error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
  } else if (error instanceof Error) {
    console.error("Error:", error.message);
  } else {
    console.error("Unknown:", error);
  }
}
