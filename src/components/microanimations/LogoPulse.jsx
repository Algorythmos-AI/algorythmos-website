import BaseAnimation from './BaseAnimation';
import logoLottie from '../../assets/lottie/logo_pulse.json';

const LogoPulse = ({ className }) => (
    <BaseAnimation
        videoSrc="/assets/microanimations/logo-pulse.webm"
        lottieSrc={logoLottie}
        fallbackSrc="/assets/microanimations/logo-fallback.png"
        className={className}
        alt="Logo heartbeat pulse"
    />
);

export default LogoPulse;
