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

export function logApiErr(err: Error): void {
  if (process.env.NODE_ENV !== "development") return;
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      console.error(err);
      return;
    }
    console.error(err.response.data.detail);
  } else {
    console.error(err.message);
  };
}
