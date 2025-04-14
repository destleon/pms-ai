import { create } from 'zustand';
import { getCurrentUser } from 'aws-amplify/auth';

interface AuthState {
  isAuthenticated: boolean;
  userRole: 'admin' | 'attendant' | null;
  setAuthenticated: (value: boolean) => void;
  setUserRole: (role: 'admin' | 'attendant' | null) => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: null,
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUserRole: (role: 'admin' | 'attendant' | null) => set({ userRole: role }),
  checkAuthStatus: async () => {
    try {
      const user = await getCurrentUser();
      const groups = user.signInDetails?.loginId ?? [];
      const role = groups.includes('admin') ? 'admin' : 'attendant';
      
      set({ 
        isAuthenticated: true,
        userRole: role
      });
    } catch (error) {
      set({ 
        isAuthenticated: false,
        userRole: null
      });
    }
  },
}));