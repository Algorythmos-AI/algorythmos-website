import BaseAnimation from './BaseAnimation';
// Placeholders
import scrollLottie from '../../assets/lottie/scroll-reveal.json?url';

const ScrollRevealFX = ({ className }) => (
    <BaseAnimation
        videoSrc="/assets/microanimations/scroll-reveal.webm"
        lottieSrc={scrollLottie}
        fallbackSrc="/assets/microanimations/scroll-fallback.png"
        className={className}
        alt="Scroll reveal dust particles"
    />
);

export default ScrollRevealFX;
