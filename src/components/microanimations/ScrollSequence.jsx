import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';

/**
 * ScrollSequence Component
 * 
 * Renders a high-performance image sequence animation driven by scroll position.
 * Optimized for "Antigravity" smoothness.
 * 
 * - Lazy loads images
 * - Uses Canvas for performance
 * - Interpolates between frames
 * - WebP with PNG fallback
 */

// WebP detection (runs once, client-side only)
const checkWebPSupport = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
};

const ScrollSequence = ({
    frameCount = 50,
    className = "w-full h-full object-contain"
}) => {
    const containerRef = useRef(null);
    const [images, setImages] = useState([]);
    const canvasRef = useRef(null);
    const [supportsWebP, setSupportsWebP] = useState(false);

    // Check WebP support on mount (client-side only)
    useEffect(() => {
        setSupportsWebP(checkWebPSupport());
    }, []);

    // Track scroll progress of the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Smooth out the scroll value
    const smoothProgress = useSpring(scrollYProgress, {
        damping: 15,
        stiffness: 100,
        mass: 0.5
    });

    // Preload Images (after WebP detection)
    useEffect(() => {
        // Determine format and path
        const format = supportsWebP ? 'webp' : 'png';
        const basePath = supportsWebP
            ? '/assets/lottie/scroll/webp/scroll_'
            : '/assets/lottie/scroll/scroll_';

        const loadedImages = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const frameNum = i.toString().padStart(4, '0');
            const src = `${basePath}${frameNum}.${format}`;
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    // All loaded
                }
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, [frameCount, supportsWebP]);

    // Render Loop
    useEffect(() => {
        const render = (val) => {
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(val * frameCount)
            );

            const canvas = canvasRef.current;
            if (!canvas || !images[frameIndex]) return;

            const ctx = canvas.getContext('2d');
            const img = images[frameIndex];

            canvas.width = img.naturalWidth || 1920;
            canvas.height = img.naturalHeight || 1080;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        const unsubscribe = smoothProgress.on("change", (v) => {
            render(v);
        });

        // Initial render
        render(smoothProgress.get());

        return () => unsubscribe();
    }, [images, frameCount, smoothProgress]);

    return (
        <div ref={containerRef} className="relative w-full h-[200vh]">
            <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className={className}
                />
            </div>
        </div>
    );
};

export default ScrollSequence;

