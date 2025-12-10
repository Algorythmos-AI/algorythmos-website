import BaseAnimation from './BaseAnimation';
import shimmerLottie from '../../assets/lottie/menu_shimmer.json';

const MenuHoverAnimation = ({ className }) => (
    <BaseAnimation
        videoSrc="/assets/microanimations/menu-shimmer.webm"
        lottieSrc={shimmerLottie}
        fallbackSrc="/assets/microanimations/menu-fallback.png"
        className={className}
        alt="Menu shimmer effect"
    />
);

export default MenuHoverAnimation;
