import { useState, useEffect } from 'react';

/**
 * Hook to detect device capabilities for performance optimization.
 * 
 * Checks:
 * 1. prefers-reduced-motion
 * 2. Network connection type (save-data, 2g/3g)
 * 3. Element availability (optional Lottie support check)
 * 
 * Returns: { isLowPower: boolean, reduceMotion: boolean }
 */
export function useDeviceCapabilities() {
    const [capabilities, setCapabilities] = useState({
        isLowPower: false,
        reduceMotion: false
    });

    useEffect(() => {
        // 1. Check Motion Preference
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        // 2. Check Network/Hardware (Heuristic)
        // Navigator.hardwareConcurrency < 4 usually implies low-end mobile
        // Navigator.connection.saveData implies user wants less data
        const isLowEnd =
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
            (navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType === '2g' || navigator.connection.effectiveType === '3g'));

        setCapabilities({
            isLowPower: !!isLowEnd,
            reduceMotion: motionQuery.matches
        });

        const handler = (e) => {
            setCapabilities(prev => ({ ...prev, reduceMotion: e.matches }));
        };

        motionQuery.addEventListener('change', handler);
        return () => motionQuery.removeEventListener('change', handler);
    }, []);

    return capabilities;
}
