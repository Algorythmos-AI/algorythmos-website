// src/app/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const STORAGE_KEY = 'algorythmos_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    // Load Google Identity Services script
    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) {
            console.warn('VITE_GOOGLE_CLIENT_ID not set - Google Sign-In disabled');
            return;
        }

        // Check if already loaded
        if (window.google?.accounts) {
            setIsGoogleLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => setIsGoogleLoaded(true);
        script.onerror = () => console.error('Failed to load Google Identity Services');
        document.head.appendChild(script);

        return () => {
            // Cleanup if needed
        };
    }, []);

    // Handle credential response from Google
    const handleCredentialResponse = useCallback((response) => {
        try {
            // SECURITY NOTE: JWT is decoded without signature verification.
            // This is acceptable because: (1) token comes directly from Google GIS SDK,
            // (2) no backend relies on this token for authorization decisions,
            // (3) data is used only for UI display purposes.
            const payload = JSON.parse(atob(response.credential.split('.')[1]));

            const userData = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                givenName: payload.given_name,
                familyName: payload.family_name,
            };

            setUser(userData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error processing Google credential:', error);
        }
    }, []);

    // Initialize Google Sign-In
    useEffect(() => {
        if (!isGoogleLoaded || !GOOGLE_CLIENT_ID) return;

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
            });
        } catch (error) {
            console.error('Error initializing Google Sign-In:', error);
        }
    }, [isGoogleLoaded, handleCredentialResponse]);

    // Sign in function
    const signIn = useCallback(() => {
        if (!isGoogleLoaded || !window.google?.accounts) {
            console.error('Google Identity Services not loaded');
            return;
        }

        window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // One Tap not available, use popup
                window.google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: 'email profile',
                    callback: (tokenResponse) => {
                        if (tokenResponse.access_token) {
                            // Fetch user info with the access token
                            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                            })
                                .then(res => res.json())
                                .then(info => {
                                    const userData = {
                                        id: info.sub,
                                        name: info.name,
                                        email: info.email,
                                        picture: info.picture,
                                        givenName: info.given_name,
                                        familyName: info.family_name,
                                    };
                                    setUser(userData);
                                    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
                                })
                                .catch(err => console.error('Error fetching user info:', err));
                        }
                    },
                }).requestAccessToken();
            }
        });
    }, [isGoogleLoaded]);

    // Sign out function
    const signOut = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);

        if (window.google?.accounts) {
            window.google.accounts.id.disableAutoSelect();
        }
    }, []);

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        isGoogleLoaded,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
