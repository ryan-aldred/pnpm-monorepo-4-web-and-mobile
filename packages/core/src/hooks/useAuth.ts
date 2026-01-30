import { create } from 'zustand';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  setSession: (session: AuthSession | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,
  error: null,
  setSession: (session) => set({ session, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clear: () => set({ session: null, isLoading: false, error: null }),
}));

export function useAuth() {
  const { session, isLoading, error } = useAuthStore();

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    isAuthenticated: !!session,
    isLoading,
    error,
  };
}
