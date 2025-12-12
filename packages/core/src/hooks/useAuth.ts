import { create } from 'zustand';

interface AuthState {
  user: { id: number; name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Example auth store using Zustand
export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // In a real app, this would call the API
    // For now, just simulate a login
    set({
      user: { id: 1, name: 'Demo User', email },
      isAuthenticated: true,
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
