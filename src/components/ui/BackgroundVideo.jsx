import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * BackgroundVideo Component
 * Renders a loopable background video with fallback to a poster image.
 * 
 * Props:
 * - videoSrc: string (URL to mp4/webm)
 * - posterSrc: string (URL to image)
 * - opacity: number (0-1, default 0.4)
 * - className: string
 */
const BackgroundVideo = ({
    videoSrc,
    posterSrc,
    opacity = 0.4,
    className = ""
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}>
            {/* Overlay for opacity/tint control */}
            <div
                className="absolute inset-0 bg-[#070A14] transition-opacity duration-700"
                style={{ opacity: 1 - opacity }}
            />

            {/* Video Element */}
            {videoSrc && (
                <video
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onCanPlay={() => setIsLoaded(true)}
                    poster={posterSrc}
                >
                    <source src={videoSrc} type="video/mp4" />
                    {/* Add WebM support if needed later */}
                </video>
            )}

            {/* Fallback/Poster Image (Visible while video loads or if video fails) */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
                style={{ backgroundImage: `url(${posterSrc})` }}
            />
        </div>
    );
};

export default BackgroundVideo;
