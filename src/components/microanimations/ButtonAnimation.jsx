import BaseAnimation from './BaseAnimation';
import hoverLottie from '../../assets/lottie/button_hover.json';

const ButtonAnimation = ({ className }) => (
    <BaseAnimation
        videoSrc="/assets/microanimations/button-hover.webm"
        lottieSrc={hoverLottie} // Assuming vite loader handles this
        fallbackSrc="/assets/microanimations/button-fallback.png"
        className={className}
        alt="Button hover glow"
    />
);

export default ButtonAnimation;
