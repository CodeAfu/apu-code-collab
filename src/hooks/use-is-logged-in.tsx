// import { useGetAuthToken } from "@/stores/auth-store";
// import { DecodedToken } from "@/types/auth";
// import { jwtDecode } from "jwt-decode";
//
// export const useIsLoggedIn = (): boolean => {
//   const token = useGetAuthToken();
//   
//   if (typeof window === "undefined") return false;
//
//   if (!token?.access_token) return false;
//
//   try {
//     const decoded = jwtDecode<DecodedToken>(token.access_token);
//     const now = Date.now() / 1000;
//
//     if (decoded.type !== "access") return false;
//
//     // Check if either token is still valid
//     if (decoded.exp >= now) return true;
//
//
//     return false;
//   } catch {
//     return false;
//   }
// };
