// store/useResultStore.js
"use client"; // required in Next.js for client-side Zustand stores

import { create } from "zustand";

export const useResultStore = create((set, get) => ({
    mainListings: [],
    related: [],
    loading: false,
    error: null,
    fetchedCache: {},

    normalize: (str) => (str ? str.trim().toLowerCase() : ""),

    fetchResults: async (district, categorySlug) => {
        const normalize = get().normalize;
        const key = `${normalize(district)}__${normalize(categorySlug)}`;
        const { fetchedCache } = get();

        if (fetchedCache[key]) {
            // ✅ Use cached data if available
            set({
                mainListings: fetchedCache[key].mainListings,
                related: fetchedCache[key].related,
                loading: false,
                error: null,
            });
            return;
        }

        try {
            set({ loading: true, error: null });

            // Fetch from Next.js API route
            const query = new URLSearchParams({ district });
            const res = await fetch(`/api/get-listings-with-filters/${categorySlug}?${query.toString()}`);
            const data = await res.json();

            const mainListings = data.mainListings || [];
            const related = data.related || [];

            // Cache the results
            set((state) => ({
                mainListings,
                related,
                loading: false,
                fetchedCache: {
                    ...state.fetchedCache,
                    [key]: { mainListings, related },
                },
            }));
        } catch (err) {
            set({ loading: false, error: err.message });
            console.error("Error fetching results:", err);
        }
    },
}));
