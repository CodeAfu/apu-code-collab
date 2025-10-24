import useAuthStore, { useGetAuthToken } from "@/stores/auth-store";
import { DecodedToken, Token } from "@/types/auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "./consts";

const refreshAccessToken = async (refreshToken: string): Promise<Token> => {
  const response = await axios.post<Token>(
    `${API_BASE_URL}/api/v1/auth/refresh`,
    { refresh_token: refreshToken }
  );
  return response.data;
};

export const withAuth = <T extends unknown[], R>(func: (...args: T) => R) => {
  return async (...args: T): Promise<R> => {
    if (typeof window === "undefined") {
      throw Error("'withAuth()' must be used within a client component.");
    }

    const token = useGetAuthToken();

    if (!token?.access_token) {
      throw Error("No authentication token found");
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token.access_token);
      const now = Date.now() / 1000;

      if (decoded.type !== "access") {
        throw Error("Invalid token type");
      }

      // Token expired - attempt refresh
      if (decoded.exp < now) {
        if (!token.refresh_token) {
          throw Error("No refresh token available");
        }

        try {
          const refreshDecoded = jwtDecode<DecodedToken>(token.refresh_token);

          if (refreshDecoded.exp < now) {
            throw Error("Refresh token expired");
          }

          const newToken = await refreshAccessToken(token.refresh_token);
          useAuthStore.getState().setToken(newToken);
        } catch {
          useAuthStore.getState().clearToken();
          throw Error("Session expired. Please login again.");
        }
      }

      return func(...args);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw Error("Invalid token");
    }
  };
};

export const withRole = <T extends unknown[], R>(
  allowedRoles: string[],
  func: (...args: T) => R
) => {
  return withAuth(async (...args: T): Promise<R> => {
    const token = useGetAuthToken();
    const decoded = jwtDecode<DecodedToken>(token!.access_token);

    if (!allowedRoles.includes(decoded.role)) {
      throw Error("Insufficient permissions");
    }

    return func(...args);
  });
};
