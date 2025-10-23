export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// export const API_BASE_URL = process.env.NEXT_PUBLIC_RAILWAY_PRODUCTION;

if (
  API_BASE_URL === process.env.NEXT_PUBLIC_BACKEND_URL &&
  typeof window === "undefined"
) {
  console.warn("API_BASE_URL is set to localhost.");
}

if (
  !process.env.NEXT_PUBLIC_RAILWAY_PRODUCTION &&
  typeof window === "undefined"
) {
  console.warn(
    "API_BASE_URL falling back to default. Set NEXT_PUBLIC_RAILWAY_PRODUCTION in your environment."
  );
}
