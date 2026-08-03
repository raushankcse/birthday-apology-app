import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { usePageTransition } from '@/hooks/usePageTransition';

interface Page2HappinessMeterProps {
  onNext?: () => void;
}

export const Page2HappinessMeter = ({ onNext }: Page2HappinessMeterProps) => {
  const { pageRef, transitionToNext } = usePageTransition();
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPercent, setCurrentPercent] = useState(0);

  const percentages = [0, 20, 50, 75, 95, 120];
  const floatingEmojis = ['🩷', '🥰', '🤗', '✨', '💖', '💘', '🌸'];

  useEffect(() => {
    let currentIndex = 0;

    const animateProgress = () => {
      if (currentIndex >= percentages.length) {
        setShowConfetti(true);
        return;
      }

      const targetPercent = percentages[currentIndex];

      gsap.to(
        { value: currentPercent },
        {
          value: targetPercent,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: function () {
            const newPercent = Math.round(this.targets()[0].value);
            setCurrentPercent(newPercent);

            if (progressRef.current) {
              const barWidth = Math.min((newPercent / 120) * 100, 100);
              progressRef.current.style.width = `${barWidth}%`;
            }
          },
          onComplete: () => {
            currentIndex++;
            setTimeout(animateProgress, 600);
          },
        }
      );
    };

    const timer = setTimeout(animateProgress, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showConfetti) {
      // Trigger big blast confetti effect when 120% is reached
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF2E93', '#d946ef', '#a855f7', '#FFD700'],
      });

      // Fireworks effect blast
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 360,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#FF2E93', '#FFD700', '#ffffff'],
        });
      }, 400);
    }
  }, [showConfetti]);

  const handleNext = async () => {
    await transitionToNext(() => {
      onNext?.();
    });
  };

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen w-full bg-gradient-to-b from-[#1a1a2e] via-[#0a0a0f] to-[#2E114E] flex flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Background Floating Emojis Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => {
          const randomEmoji = floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)];
          const randomLeft = Math.random() * 100;
          const randomDuration = 4 + Math.random() * 4; 
          const randomDelay = Math.random() * 5;
          const randomSize = 1.5 + Math.random() * 1.5;

          return (
            <div
              key={i}
              className="absolute select-none opacity-90 drop-shadow-[0_0_8px_rgba(255,46,147,0.6)]"
              style={{
                left: `${randomLeft}%`,
                bottom: '-15%',
                fontSize: `${randomSize}rem`,
                animation: `flyUp ${randomDuration}s linear infinite`,
                animationDelay: `${randomDelay}s`,
              }}
            >
              {randomEmoji}
            </div>
          );
        })}
      </div>

      {/* Inline keyframes for bottom-to-top floating */}
      <style>{`
        @keyframes flyUp {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-110vh) scale(1.2) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Cuteness Meter
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Measuring your cuteness... ✂️
        </p>

        {/* Percentage Display */}
        <div
          ref={percentRef}
          className="text-5xl md:text-7xl font-bold text-pink-400 mb-6 italic tracking-wider transition-all duration-300"
        >
          {currentPercent}%
        </div>

        {/* Progress Container */}
        <div className="mb-6">
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-pink-400/40 mb-3">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
              style={{ width: '0%' }}
            />
          </div>

          {/* Warning text shows only after reaching 120% */}
          {showConfetti && (
            <div className="text-xs md:text-sm tracking-widest text-pink-300 font-semibold uppercase animate-bounce mt-2">
              ⚠️ WARNING: TOO CUTE TO HANDLE
            </div>
          )}
        </div>

        {/* Continue Button appears after reaching 120% */}
        {showConfetti && (
          <div className="mt-6 animate-fade-in">
            <button
              onClick={handleNext}
              className="btn-glow text-lg md:text-xl px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg cursor-pointer"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};