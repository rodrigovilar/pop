import { theme } from '../styles/theme';

/**
 * BreezeBackground - Animated gradient background component
 *
 * Creates a calming, flowing effect with blue/green gradients
 * that move gently across the screen, representing patience and flow.
 */
export function BreezeBackground() {
  return (
    <>
      <style>{`
        @keyframes breeze1 {
          0%, 100% {
            transform: translate(0%, 0%) rotate(0deg);
            opacity: 0.6;
          }
          33% {
            transform: translate(10%, -5%) rotate(5deg);
            opacity: 0.8;
          }
          66% {
            transform: translate(-5%, 10%) rotate(-3deg);
            opacity: 0.7;
          }
        }

        @keyframes breeze2 {
          0%, 100% {
            transform: translate(0%, 0%) rotate(0deg);
            opacity: 0.5;
          }
          33% {
            transform: translate(-8%, 8%) rotate(-4deg);
            opacity: 0.7;
          }
          66% {
            transform: translate(12%, -6%) rotate(6deg);
            opacity: 0.6;
          }
        }

        @keyframes breeze3 {
          0%, 100% {
            transform: translate(0%, 0%) rotate(0deg);
            opacity: 0.4;
          }
          33% {
            transform: translate(6%, 10%) rotate(3deg);
            opacity: 0.6;
          }
          66% {
            transform: translate(-10%, -8%) rotate(-5deg);
            opacity: 0.5;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0%);
          }
          50% {
            transform: translateY(-3%);
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

        .breeze-layer {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          mix-blend-mode: multiply;
          will-change: transform, opacity;
        }

        .breeze-layer-1 {
          width: 600px;
          height: 600px;
          top: -200px;
          right: -100px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0) 70%);
          animation: breeze1 25s ease-in-out infinite;
        }

        .breeze-layer-2 {
          width: 700px;
          height: 700px;
          bottom: -250px;
          left: -150px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%);
          animation: breeze2 30s ease-in-out infinite;
        }

        .breeze-layer-3 {
          width: 500px;
          height: 500px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 50%, rgba(16, 185, 129, 0) 70%);
          animation: breeze3 35s ease-in-out infinite;
        }

        .breeze-layer-4 {
          width: 450px;
          height: 450px;
          top: 20%;
          left: 10%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0) 70%);
          animation: float 20s ease-in-out infinite;
        }

        .breeze-layer-5 {
          width: 550px;
          height: 550px;
          bottom: 15%;
          right: 15%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%);
          animation: float 28s ease-in-out infinite reverse;
        }

        /* Subtle gradient lines */
        .breeze-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(59, 130, 246, 0.3) 30%,
            rgba(16, 185, 129, 0.3) 70%,
            transparent 100%
          );
          filter: blur(1px);
          will-change: transform;
        }

        .breeze-line-1 {
          width: 80%;
          top: 25%;
          left: -40%;
          animation: lineMove1 40s linear infinite;
        }

        .breeze-line-2 {
          width: 70%;
          top: 60%;
          right: -35%;
          animation: lineMove2 35s linear infinite reverse;
        }

        .breeze-line-3 {
          width: 60%;
          top: 85%;
          left: -30%;
          animation: lineMove1 45s linear infinite;
        }

        @keyframes lineMove1 {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(150%);
          }
        }

        @keyframes lineMove2 {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-150%);
          }
        }

        @media (max-width: 768px) {
          .breeze-layer {
            filter: blur(60px);
          }
          .breeze-layer-1,
          .breeze-layer-2,
          .breeze-layer-3,
          .breeze-layer-4,
          .breeze-layer-5 {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>

      <div className="breeze-container">
        {/* Animated gradient blobs */}
        <div className="breeze-layer breeze-layer-1" />
        <div className="breeze-layer breeze-layer-2" />
        <div className="breeze-layer breeze-layer-3" />
        <div className="breeze-layer breeze-layer-4" />
        <div className="breeze-layer breeze-layer-5" />

        {/* Subtle moving lines */}
        <div className="breeze-line breeze-line-1" />
        <div className="breeze-line breeze-line-2" />
        <div className="breeze-line breeze-line-3" />
      </div>
    </>
  );
}
