"use client";

import { create } from "zustand";

const useProfileStore = create((set) => ({
    profile: null,         // stores user profile
    loading: false,        // loading state
    error: null,           // error state

    fetchProfile: async () => {
        set({ loading: true, error: null });

        try {
            const res = await fetch("/api/my-profile"); // your route
            if (!res.ok) {
                const err = await res.json();
                set({ error: err.message, loading: false });
                return null;
            }

            const data = await res.json();

            set({
                profile: data.user,           // user info without password/id
                loading: false,
            });

            return data.user;
        } catch (err) {
            set({ error: "Failed to fetch profile", loading: false });
            return null;
        }
    },

    resetProfile: () => set({ profile: null, loading: false, error: null }),
}));

export default useProfileStore;
