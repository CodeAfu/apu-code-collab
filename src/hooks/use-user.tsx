import { decodeToken, refreshAccessToken } from "@/lib/auth";
import { devLog } from "@/lib/utils";
import useAuthStore from "@/stores/auth-store";
import { useMemo, useState, useEffect } from "react";

export const useUser = () => {
  const token = useAuthStore((state) => state.token?.access_token);
  const clearToken = useAuthStore((state) => state.clearToken);

  const [isHydrated, setIsHydrated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => setIsHydrated(true), []);

  const user = useMemo(() => {
    if (!isHydrated || !token) return null;
    const decoded = decodeToken(token);
    if (!decoded) return null;

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) return null;
    return decoded;
  }, [token, isHydrated]);

  const isAuthenticated = !!user;
  const isTokenInvalidButPresent = !!token && !isAuthenticated;

  useEffect(() => {
    if (isHydrated && token && !isAuthenticated) {
      setIsRefreshing(true);
      refreshAccessToken()
        .catch((error) => {
          const status = error.response?.status;
          if (status === 401 || status == 403) {
            clearToken();
            return;
          }
          console.error("Refresh failed (Server Error), keeping session.");
        })
        .finally(() => {
          setIsRefreshing(false);
        });
    }
  }, [isAuthenticated, isHydrated, token, clearToken])

  // devLog("Access Token:", token)

  return {
    user,
    isAuthenticated,
    isRole: (role: string) => user?.role === role,
    logout: clearToken,
    isLoading: !isHydrated || isRefreshing || isTokenInvalidButPresent,
  };
};
