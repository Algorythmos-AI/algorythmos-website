/**
 * Premium SVG Flags for Region Selector
 * High-quality vector paths for Global, France, and Australia
 * Optimized for small sizes (16-24px)
 */
import React from "react";

export const FlagGlobal = ({ className = "w-5 h-5" }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-gray-500" />
        <path
            d="M2 12H22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-gray-500"
        />
        <path
            d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-gray-500"
        />
    </svg>
);

export const FlagFR = ({ className = "w-6 h-4" }) => (
    <svg
        viewBox="0 0 30 20"
        xmlns="http://www.w3.org/2000/svg"
        className={`rounded-sm shadow-sm ${className}`}
        aria-hidden="true"
    >
        <rect width="30" height="20" fill="#ED2939" />
        <rect width="20" height="20" fill="#FFFFFF" />
        <rect width="10" height="20" fill="#002395" />
    </svg>
);

export const FlagAU = ({ className = "w-6 h-4" }) => (
    <svg
        viewBox="0 0 640 480"
        xmlns="http://www.w3.org/2000/svg"
        className={`rounded-sm shadow-sm ${className}`}
        aria-hidden="true"
    >
        {/* Blue background */}
        <path fill="#00008B" d="M0 0h640v480H0z" />

        {/* Union Jack in canton */}
        <g transform="scale(0.5)">
            {/* White diagonals */}
            <path fill="#FFF" d="M0 0l360 240h-45L0 22.5V0zM360 0L0 240v-22.5l315-217.5h45z" />
            {/* Red diagonals */}
            <path fill="#C8102E" d="M0 0l360 240h-22.5L0 11.25V0zM360 0L0 240v-11.25l337.5-228.75h22.5z" />
            {/* White cross */}
            <path fill="#FFF" d="M150 0v240h60V0H150zM0 90v60h360V90H0z" />
            {/* Red cross */}
            <path fill="#C8102E" d="M165 0v240h30V0H165zM0 105v30h360v-30H0z" />
        </g>

        {/* Commonwealth Star (7-pointed) */}
        <path fill="#FFF" d="M166.7 340.4l8.8-27.2 8.8 27.2-23-16.7h28.4z" />
        <path fill="#FFF" d="M166.7 340.4l-14.2-19.5 25.4 4.9-25.4 4.8 14.2-19.4z" transform="rotate(25.7 166.7 326)" />

        {/* Southern Cross */}
        {/* Alpha Crucis (bottom) */}
        <path fill="#FFF" d="M466.7 415l16.6-51.3 16.6 51.3-43.5-31.6h53.8z" />
        {/* Beta Crucis (left) */}
        <path fill="#FFF" d="M366.7 312l9.1-28 9.1 28-23.8-17.3h29.4z" />
        {/* Gamma Crucis (top) */}
        <path fill="#FFF" d="M480 129.6l10.8-33.4 10.8 33.4-28.3-20.6h35z" />
        {/* Delta Crucis (right) */}
        <path fill="#FFF" d="M546.7 264l8-24.7 8 24.7-21-15.2h26z" />
        {/* Epsilon Crucis (small, center) */}
        <path fill="#FFF" d="M560 180l5-15.3 5 15.3-13-9.5h16z" />
    </svg>
);

