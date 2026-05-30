/**
 * useRegionPersistence Hook
 * Manages saving and retrieving user's region preference.
 * - Saves selected region to localStorage
 * - Redirects on first visit if preference exists
 */

const STORAGE_KEY = "algorythmos_region_pref";

export const useRegionPersistence = () => {
    // Save preference whenever region changes explicitly
    const saveRegionPreference = (regionCode) => {
        localStorage.setItem(STORAGE_KEY, regionCode);
    };

    return {
        saveRegionPreference,
        getSavedRegion: () => localStorage.getItem(STORAGE_KEY),
    };
};
