import { Token } from "@/types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: Token | null;
  setToken: (token: Token) => void;
  clearToken: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "auth-token",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useSetAuthToken = () => useAuthStore((store) => store.setToken);
export const useGetAuthToken = () => useAuthStore((store) => store.token);
export const useClearAuthToken = () =>
  useAuthStore((store) => store.clearToken);
export default useAuthStore;
