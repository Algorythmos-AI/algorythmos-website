import BaseAnimation from './BaseAnimation';
import serviceLottie from '../../assets/lottie/service-hover.json?url';

const ServiceCardFX = ({ className }) => (
    <BaseAnimation
        videoSrc="/assets/microanimations/service-hover.webm"
        lottieSrc={serviceLottie}
        fallbackSrc="/assets/microanimations/service-fallback.png"
        className={className}
        alt="Service card hover effect"
    />
);

export default ServiceCardFX;
