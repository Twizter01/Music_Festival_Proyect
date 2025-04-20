import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Timer, Cpu, Zap } from 'lucide-react';
import { Scene } from './components/Scene';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2024-12-31T23:59:59');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-screen gap-12">
          <div className="text-center">
            <h1 
              className="text-6xl font-bold mb-4 glitch"
              data-text="CYBER COUNTDOWN"
            >
              CYBER COUNTDOWN
            </h1>
            <div className="flex items-center justify-center gap-2 text-[#00ffff]">
              <Zap className="w-6 h-6 animate-pulse" />
              <p className="text-xl font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                SYSTEM.INITIALIZE()
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="relative group backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff]/30 to-[#00ffff]/30 rounded-lg transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-300"></div>
                <div className="relative bg-black/50 p-8 rounded-lg border border-[#ff00ff]/50 shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-shadow">
                  <div className="font-mono text-4xl md:text-6xl font-bold text-white pixelated">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-[#00ffff] uppercase tracking-[0.2em] mt-2 font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                    {unit}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[#ff00ff]">
            <Timer className="w-6 h-6 animate-spin-slow" />
            <p className="text-lg font-bold tracking-[0.2em]" style={{ fontFamily: 'Courier New, monospace' }}>
              TIME.REMAINING()
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;