import { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Globe container */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="absolute inset-0 w-40 h-40 rounded-full bg-blue-400/20 blur-xl animate-pulse" />
        
        {/* Spinning globe */}
        <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-blue-300/30 animate-[spin_8s_linear_infinite]">
          {/* Globe base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800" />
          
          {/* Continent patterns */}
          <div className="absolute inset-0">
            {/* Africa */}
            <div className="absolute top-[35%] left-[45%] w-8 h-12 bg-green-500/80 rounded-full transform -rotate-12" />
            {/* Europe */}
            <div className="absolute top-[20%] left-[40%] w-6 h-4 bg-green-400/80 rounded-full" />
            {/* Americas simulation through animation */}
            <div className="absolute top-[25%] left-[15%] w-4 h-14 bg-green-500/80 rounded-full transform rotate-12" />
            <div className="absolute top-[45%] left-[10%] w-6 h-10 bg-green-600/80 rounded-full transform -rotate-6" />
            {/* Asia */}
            <div className="absolute top-[22%] left-[60%] w-12 h-8 bg-green-500/80 rounded-full" />
            {/* Australia */}
            <div className="absolute top-[60%] left-[70%] w-5 h-4 bg-green-400/80 rounded-full" />
          </div>
          
          {/* Cloud overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
          
          {/* Shine effect */}
          <div className="absolute top-2 left-4 w-8 h-8 bg-white/30 rounded-full blur-lg" />
        </div>

        {/* Orbit ring */}
        <div className="absolute inset-[-20px] border-2 border-dashed border-blue-400/30 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
        
        {/* Orbiting dot */}
        <div className="absolute inset-[-20px] animate-[spin_4s_linear_infinite]">
          <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
        </div>
      </div>

      {/* Text */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center tracking-wider">
        TASSA
      </h1>
      <p className="text-blue-200 text-sm mb-8 text-center max-w-xs">
        Tanzania Advanced Socratic Schools Association
      </p>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-blue-950 rounded-full overflow-hidden border border-blue-700/50">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-blue-300 text-sm mt-3">Loading... {progress}%</p>
    </div>
  );
};

export default LoadingScreen;
