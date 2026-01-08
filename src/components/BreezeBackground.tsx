import { theme } from '../styles/theme';

/**
 * BreezeBackground - Animated wave/cloud background component
 *
 * Creates horizontal wave/cloud shapes that move gently across the screen,
 * with vertical gradients from blue/green at top to white at bottom.
 * Represents patience, flow, and calm movement.
 */
export function BreezeBackground() {
  return (
    <>
      <style>{`
        @keyframes waveSlide1 {
          0% {
            transform: translateX(-10%);
          }
          100% {
            transform: translateX(10%);
          }
        }

        @keyframes waveSlide2 {
          0% {
            transform: translateX(10%);
          }
          100% {
            transform: translateX(-10%);
          }
        }

        @keyframes waveSlide3 {
          0% {
            transform: translateX(-15%);
          }
          100% {
            transform: translateX(5%);
          }
        }

        @keyframes waveSlide4 {
          0% {
            transform: translateX(5%);
          }
          100% {
            transform: translateX(-15%);
          }
        }

        .breeze-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
          background: ${theme.colors.background.primary};
        }

        .wave {
          position: absolute;
          width: 200%;
          height: 350px;
          will-change: transform;
        }

        /* Wave 1 - Blue at top */
        .wave-1 {
          top: 10%;
          left: -50%;
          background: linear-gradient(
            to bottom,
            rgba(59, 130, 246, 0.35) 0%,
            rgba(59, 130, 246, 0.15) 40%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 45% 55% 60% 40% / 30% 40% 60% 70%;
          animation: waveSlide1 40s ease-in-out infinite;
          filter: blur(60px);
        }

        /* Wave 2 - Green at middle-top */
        .wave-2 {
          top: 25%;
          right: -50%;
          background: linear-gradient(
            to bottom,
            rgba(16, 185, 129, 0.3) 0%,
            rgba(16, 185, 129, 0.12) 40%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 40% 60% 55% 45% / 35% 45% 55% 65%;
          animation: waveSlide2 50s ease-in-out infinite;
          filter: blur(65px);
        }

        /* Wave 3 - Blue at middle */
        .wave-3 {
          top: 45%;
          left: -50%;
          background: linear-gradient(
            to bottom,
            rgba(59, 130, 246, 0.4) 0%,
            rgba(59, 130, 246, 0.18) 40%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 50% 50% 45% 55% / 40% 50% 50% 60%;
          animation: waveSlide3 45s ease-in-out infinite;
          filter: blur(70px);
        }

        /* Wave 4 - Green at middle-bottom */
        .wave-4 {
          top: 60%;
          right: -50%;
          background: linear-gradient(
            to bottom,
            rgba(16, 185, 129, 0.38) 0%,
            rgba(16, 185, 129, 0.15) 40%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 55% 45% 50% 50% / 45% 55% 45% 55%;
          animation: waveSlide4 55s ease-in-out infinite;
          filter: blur(75px);
        }

        /* Wave 5 - Blue at bottom */
        .wave-5 {
          bottom: 5%;
          left: -50%;
          background: linear-gradient(
            to bottom,
            rgba(59, 130, 246, 0.45) 0%,
            rgba(59, 130, 246, 0.2) 30%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
          animation: waveSlide1 60s ease-in-out infinite reverse;
          filter: blur(80px);
        }

        /* Additional cloud-like shapes */
        .cloud {
          position: absolute;
          width: 150%;
          height: 250px;
          will-change: transform;
        }

        .cloud-1 {
          top: 35%;
          left: -30%;
          background: linear-gradient(
            to bottom,
            rgba(59, 130, 246, 0.25) 0%,
            rgba(16, 185, 129, 0.18) 30%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 48% 52% 58% 42% / 35% 55% 45% 65%;
          animation: waveSlide2 70s ease-in-out infinite;
          filter: blur(85px);
        }

        .cloud-2 {
          top: 50%;
          right: -30%;
          background: linear-gradient(
            to bottom,
            rgba(16, 185, 129, 0.28) 0%,
            rgba(59, 130, 246, 0.2) 30%,
            rgba(255, 255, 255, 0) 100%
          );
          border-radius: 42% 58% 52% 48% / 40% 60% 40% 60%;
          animation: waveSlide3 65s ease-in-out infinite reverse;
          filter: blur(90px);
        }

        @media (max-width: 768px) {
          .wave, .cloud {
            filter: blur(30px);
            height: 200px;
          }
        }
      `}</style>

      <div className="breeze-container">
        {/* Wave layers */}
        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />
        <div className="wave wave-4" />
        <div className="wave wave-5" />

        {/* Cloud layers */}
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
      </div>
    </>
  );
}
