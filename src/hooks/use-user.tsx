import api from "@/lib/api";
import { decodeToken, refreshAccessToken } from "@/lib/auth";
import { devLog, logApiError } from "@/lib/utils";
import useAuthStore from "@/stores/auth-store";
import { UserDetails } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";

export const useUser = () => {
  const token = useAuthStore((state) => state.token?.access_token);
  const clearToken = useAuthStore((state) => state.clearToken);

  const [isHydrated, setIsHydrated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => setIsHydrated(true), []);

  const decodedUserToken = useMemo(() => {
    if (!isHydrated || !token) return null;
    const decoded = decodeToken(token);
    if (!decoded) return null;

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) return null;
    return decoded;
  }, [token, isHydrated]);

  const isAuthenticated = !!decodedUserToken;
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

  const { data: userDetails, isFetching: isFetchingUserDetails, isError, error } = useQuery<UserDetails>({
    queryKey: ["users", "me"],
    queryFn: async () => {
      const response = await api.get("/api/v1/users/me");
      devLog("users/me", response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated,
  })

  if (isError) {
    logApiError(error);
  }

  devLog("Decoded User Token:", decodedUserToken);
  devLog("User Details:", userDetails);

  return {
    decodedUserToken,
    isAuthenticated,
    isRole: (role: string) => decodedUserToken?.role === role,
    logout: clearToken,
    isLoading: !isHydrated || isRefreshing || isTokenInvalidButPresent,

    userDetails,
    isFetchingUserDetails,
    isError,
    error,
  };
};
