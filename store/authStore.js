"use client";

import { create } from "zustand";

const useAuthStore = create((set) => ({
    userId: null,
    isAuthenticated: false,
    checkAuth: async () => {
        try {
            const res = await fetch("/api/check-auth");
            if (res.ok) {
                const data = await res.json();
                set({ userId: data.userId, isAuthenticated: true });
                return true;
            } else {
                set({ userId: null, isAuthenticated: false });
                return false;
            }
        } catch {
            set({ userId: null, isAuthenticated: false });
            return false;
        }
    },
    logout: () => set({ userId: null, isAuthenticated: false }),
}));

export default useAuthStore;
