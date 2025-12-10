import BaseAnimation from './BaseAnimation';
import glowLottie from '../../assets/lottie/footer_glow.json';

const FooterGlow = ({ className }) => (
    <BaseAnimation
        videoSrc="/assets/microanimations/footer-glow.webm"
        lottieSrc={glowLottie}
        fallbackSrc="/assets/microanimations/footer-fallback.png"
        className={className}
        alt="Footer ambient glow"
    />
);

export default FooterGlow;
