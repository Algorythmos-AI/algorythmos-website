import React, { useState, Suspense } from 'react';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

// Lazy load Lottie to save bundle size
const Lottie = React.lazy(() => import('lottie-react'));

/**
 * BaseAnimation Component
 * 
 * Intelligently switches between:
 * - High-end: WebM/MP4 Video (Seamless Loop)
 * - Mid-range: Lottie Animation (JSON)
 * - Low-end/Reduced Motion: Static Fallback / CSS only
 * 
 * Props:
 * - videoSrc: string (path to webm)
 * - lottieSrc: object (imported json)
 * - fallbackSrc: string (path to image)
 * - className: string
 * - alt: string
 */
const BaseAnimation = ({
    videoSrc,
    lottieSrc,
    fallbackSrc,
    className = "",
    alt = ""
}) => {
    const { isLowPower, reduceMotion } = useDeviceCapabilities();
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. If user specifically requested reduced motion, show fallback strictly.
    if (reduceMotion) {
        return (
            <div
                className={`bg-contain bg-center bg-no-repeat ${className}`}
                style={{ backgroundImage: `url(${fallbackSrc})` }}
                role="img"
                aria-label={alt}
            />
        );
    }

    // 2. Low Power Mode: Use Lottie (Vector) or Fallback if Lottie missing
    if (isLowPower && lottieSrc) {
        return (
            <Suspense fallback={<div className={className} />}>
                <Lottie
                    animationData={lottieSrc}
                    loop={true}
                    className={className}
                />
            </Suspense>
        );
    }

    // 3. High Performance: Video
    // Note: We intentionally don't lazily load the video *tag* because browser native handling is best.
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Video Layer */}
            {videoSrc && !isLowPower && (
                <video
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onCanPlay={() => setIsLoaded(true)}
                >
                    <source src={videoSrc} type="video/webm" />
                    {/* Add MP4 fallback source logic if needed */}
                </video>
            )}

            {/* Fallback Layer (Visible until video loads) */}
            <div
                className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
                style={{ backgroundImage: `url(${fallbackSrc})` }}
            />
        </div>
    );
};

export default BaseAnimation;
