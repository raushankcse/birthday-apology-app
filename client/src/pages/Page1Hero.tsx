import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePageTransition } from '@/hooks/usePageTransition';

interface Page1HeroProps {
  herName?: string;
  onNext?: () => void;
}

export const Page1Hero = ({ onNext }: Page1HeroProps) => {
  const { pageRef, transitionToNext } = usePageTransition();
  const characterRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Animate character with a hanging/swinging pendulum effect from the top center
    if (characterRef.current) {
      gsap.fromTo(
        characterRef.current,
        { rotation: -12 },
        {
          rotation: 12,
          duration: 1.8,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: 'top center',
        }
      );
    }

    // Stagger text animations
    const timeline = gsap.timeline();

    if (titleRef.current) {
      timeline.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0
      );
    }

    if (subtitleRef.current) {
      timeline.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.2
      );
    }

    if (buttonRef.current) {
      timeline.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out' },
        0.4
      );

      // Add glow pulse to button
      gsap.fromTo(
        buttonRef.current,
        { boxShadow: '0 0 20px rgba(255, 46, 147, 0.6)' },
        {
          boxShadow: '0 0 40px rgba(255, 46, 147, 0.8)',
          duration: 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.2,
        }
      );
    }
  }, []);

  const handleNext = async () => {
    await transitionToNext(() => {
      onNext?.();
    });
  };

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen w-full bg-gradient-to-b from-[#2E114E] via-[#1a1a2e] to-[#0a0a0f] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pink-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl flex flex-col items-center">
        {/* Animated Character - Teddy Hanging/Swinging Effect */}
        <div
          ref={characterRef}
          className="mb-8 flex flex-col items-center"
        >
          {/* Optional hanging string line */}
          <div className="w-0.5 h-10 bg-pink-400/40 -mt-10 mb-0" />
          <img
            src="/teddy2.png"
            alt="Teddy Bear"
            className="w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-lg"
          />
        </div>

        {/* Main Title - Heart Removed */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Happy Birthday <br />
          Parul
        </h1>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className="text-lg md:text-2xl text-gray-300 space-y-4 mb-12"
        >
          <p>Today isn't just your birthday...</p>
          <p>It's my chance to make your beautiful smile return.</p>
          <p className="text-pink-300 italic">
            "I know I made mistakes."
          </p>
          <p className="text-pink-300 italic">
            "But I never stopped loving you."
          </p>
        </div>

        {/* CTA Button */}
        <button
          ref={buttonRef}
          onClick={handleNext}
          className="btn-glow text-lg md:text-xl"
        >
          ✨ Start the Surprise ✨
        </button>
      </div>

      {/* Floating hearts background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-pulse"
            style={{
              left: `${20 + i * 30}%`,
              animation: `heart-float ${4 + i}s ease-in infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>
    </div>
  );
};