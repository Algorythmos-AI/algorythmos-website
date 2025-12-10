import BaseAnimation from './BaseAnimation';
import transitionLottie from '../../assets/lottie/page-transition.json?url';

const PageTransitionFX = ({ className }) => (
    <BaseAnimation
        videoSrc="/assets/microanimations/page-transition.webm"
        lottieSrc={transitionLottie}
        fallbackSrc="/assets/microanimations/transition-fallback.png"
        className={className}
        alt="Page transition effect"
    />
);

export default PageTransitionFX;
