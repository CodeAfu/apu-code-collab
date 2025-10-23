import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

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
      name: 'auth-token',
    }
  )
);

export default useAuthStore;