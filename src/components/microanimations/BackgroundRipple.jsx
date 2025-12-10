import BaseAnimation from './BaseAnimation';
import rippleLottie from '../../assets/lottie/bg-ripple.json?url';

const BackgroundRipple = ({ className }) => (
    <BaseAnimation
        videoSrc="/assets/microanimations/bg-ripple.webm"
        lottieSrc={rippleLottie}
        fallbackSrc="/assets/microanimations/bg-fallback.png"
        className={className}
        alt="Abstract background ripple"
    />
);

export default BackgroundRipple;
