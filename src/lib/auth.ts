import axios from "axios";
import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  id: string;
  sub: string;
  role: string;
  type: "access" | "refresh";
  exp: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
}

export const refreshAccessToken = async (): Promise<string> => {
  console.log("Calling refresh endpoint...");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    throw error;
  }
};

export const withAuth = <T extends unknown[], R>(
  func: (...args: T) => Promise<R>,
) => {
  return async (...args: T): Promise<R> => {
    if (typeof window === "undefined") {
      throw Error("'withAuth()' must be used within a client component.");
    }

    let token = localStorage.getItem("accessToken");

    // Token exists and not expired
    if (token) {
      const decoded = decodeToken(token);
      // console.log(decoded);
      if (decoded) {
        const now = Math.floor(Date.now() / 1000);
        const expTimestamp =
          typeof decoded.exp === "number"
            ? decoded.exp
            : Math.floor(new Date(decoded.exp).getTime() / 1000);

        if (expTimestamp >= now) {
          return await func(...args);
        }
      }
    }
    // Refresh: no token, invalid token, expired token

    try {
      token = await refreshAccessToken();
    } catch {
      localStorage.removeItem("accessToken");
      // window.location.href = "/auth/login";
      throw new Error("Session expired. Please login again");
    }

    return await func(...args);
  };
};

// export const withRole = <T extends unknown[], R>(
//   allowedRoles: string[],
//   func: (...args: T) => R
// ) => {
//   return withAuth(async (...args: T): Promise<R> => {
//     const token = useGetAuthToken();
//     const decoded = jwtDecode<DecodedToken>(token!.access_token);
//
//     if (!allowedRoles.includes(decoded.role)) {
//       throw Error("Insufficient permissions");
//     }
//
//     return func(...args);
//   });
// };
