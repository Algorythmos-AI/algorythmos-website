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
        <path fill="#00008b" d="M0 0h640v480H0z" />
        <path fill="#fff" d="M0 0h640v480H0z" mask="url(#a)" />
        <defs>
            <mask id="a">
                <path fill="#fff" d="M0 0h640v480H0z" />
                <path d="M0 0l333.3 480h-90L0 129.6zM0 480l333.3-480h-90L0 350.4z" />
                <path d="M298.6 0L0 430.1v-86L238.9 0zM0 0l298.6 430.1v-86L59.7 0z" />
                <path fill="#00008b" d="M0 0h360v240H0z" />
                <path fill="#fff" d="M0 0l360 240H184L0 117.3zM0 240L360 0h-97.2L0 175.2z" />
                <path d="M322.6 0L0 215v-43L257.8 0zM0 0l322.6 215v-43L64.8 0z" />
                <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="38.4"
                    d="M0 120h360M180 0v240"
                />
                <path
                    fill="none"
                    stroke="red"
                    strokeWidth="24"
                    d="M0 120h360M180 0v240"
                />
            </mask>
        </defs>
        <path
            fill="#fff"
            d="M166.7 348l13-40 13.1 40-34-24.7h42zM480 129.6l17-52.4 17 52.4-44.5-32.3h55zM560 64.8l7-21.5 7 21.5-18.3-13.3h22.6zM466.7 312l9.1-28 9.2 28-23.9-17.3h29.5zM546.7 264l5-15.3 5 15.3-13-9.5h16zM466.7 416l25-77 25 77-65.5-47.6H532z"
        />
    </svg>
);
