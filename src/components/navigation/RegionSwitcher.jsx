import React from 'react';
import { setLocale } from '../../lib/locale';

/**
 * Region Switcher Component
 * A simple, powerful switcher that updates the cookie and forces a reload/redirect via setLocale.
 */
export default function RegionSwitcher() {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setLocale("en")}
                className="px-3 py-1 rounded-md hover:bg-white/10 transition text-sm text-gray-300 hover:text-white"
                type="button"
            >
                Global
            </button>

            <button
                onClick={() => setLocale("au-en")}
                className="px-3 py-1 rounded-md hover:bg-white/10 transition text-sm text-gray-300 hover:text-white"
                type="button"
            >
                Australia
            </button>

            <button
                onClick={() => setLocale("fr-fr")}
                className="px-3 py-1 rounded-md hover:bg-white/10 transition text-sm text-gray-300 hover:text-white"
                type="button"
            >
                France
            </button>
        </div>
    );
}
