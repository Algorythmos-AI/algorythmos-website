import React, { useEffect, useState } from "react";

const ScrollProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let ticking = false;

        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            if (docHeight > 0) {
                const scrolled = (scrollTop / docHeight) * 100;
                setProgress(Math.min(100, Math.max(0, scrolled)));
            } else {
                setProgress(0);
            }
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial calculation
        updateProgress();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            aria-hidden="true"
            className="fixed top-0 left-0 w-full z-[100] h-[3px] pointer-events-none"
        >
            <div
                className="h-full bg-gradient-to-r from-algviolet via-violet-500 to-algblue transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ScrollProgressBar;
