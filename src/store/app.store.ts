import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    user: string | null;
    login: (user: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

interface Launch {
    flight_number: number;
    name: string;
    date_utc: string;
    success: boolean | null;
}

interface LaunchState {
    launches: Launch[];
    setLaunches: (launches: Launch[]) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
            isAuthenticated: () => !!get().user,
        }),
        {
            name: 'auth-storage',
        }
    )
);

export const useLaunchStore = create<LaunchState>((set) => ({
    launches: [],
    setLaunches: (launches) => set({ launches }),
}))