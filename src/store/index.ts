
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, AppState, NotificationData } from '@/types';

interface GlobalState extends AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Notifications
  notifications: NotificationData[];
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearError: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        theme: 'light',
        sidebarCollapsed: false,
        notifications: [],

        // Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        clearError: () => set({ error: null }),
        
        setTheme: (theme) => set({ theme }),
        
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        
        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        
        addNotification: (notification) => {
          const newNotification: NotificationData = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            read: false,
          };
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
          }));
        },
        
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
        
        markNotificationAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          })),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'GlobalStore' }
  )
);
