import useAuthStore from "@/stores/auth-store";
import { useEffect } from "react";

export const useAuthSync = () => {
  const clearToken = useAuthStore((state) => state.clearToken);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "auth-token") {
        const newValue = event.newValue;
        if (!newValue || newValue === "null") {
          clearToken();
        } else {
          window.location.reload();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [clearToken]);
};
