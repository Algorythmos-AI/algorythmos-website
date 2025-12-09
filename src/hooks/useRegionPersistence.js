/**
 * useRegionPersistence Hook
 * Manages saving and retrieving user's region preference.
 * - Saves selected region to localStorage
 * - Redirects on first visit if preference exists
 */
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { REGIONS } from "../app/i18n/I18nContext.jsx";


const STORAGE_KEY = "algorythmos_region_pref";

export const useRegionPersistence = (currentRegion, setLanguageAndRegion) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Save preference whenever region changes explicitly
    const saveRegionPreference = (regionCode) => {
        localStorage.setItem(STORAGE_KEY, regionCode);
    };

    return {
        saveRegionPreference,
        getSavedRegion: () => localStorage.getItem(STORAGE_KEY),
    };
};
