
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Footprints } from "lucide-react";

function LoadingTransition() {
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setLoading(true);
    setProgress(0);

    const start = Date.now();
    const duration = 500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const value = Math.min(
        Math.round((elapsed / duration) * 100),
        100
      );

      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [location.key]);

  if (!loading) return null;

  return (
    <div className="fixed inset-x-0 top-20 bottom-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#101010]/90 backdrop-blur-lg">

      {/* BACKGROUND LIGHTS */}
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-[100px]" />

      {/* BRAND */}
      

      {/* SHOE ANIMATION */}
      <div className="relative flex h-56 w-full max-w-xl items-center justify-center">

        {/* ORANGE LIGHT */}
        <div className="absolute bottom-5 h-1 w-64 rounded-full bg-amber-500 blur-md animate-pulse" />

        {/* SHOE ICON */}
        <div className="shoe-runway relative z-10 text-amber-500">
          <Footprints size={120} strokeWidth={1.1} />
        </div>

        {/* RUNWAY LINES */}
        <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        <div className="absolute bottom-[-12px] h-5 w-64 bg-amber-500/20 blur-xl" />
      </div>

      {/* LOADING TEXT */}
      <div className="mt-10 w-64">

        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-[4px] text-gray-400">
            LOADING EXPERIENCE
          </p>

          <p className="text-sm font-bold text-amber-500">
            {progress}%
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-4 h-[2px] w-full overflow-hidden bg-gray-700">
          <div
            className="h-full bg-amber-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-5 text-center text-[9px] tracking-[5px] text-gray-600">
          WALK YOUR STYLE
        </p>
      </div>

    </div>
  );
}

export default LoadingTransition;
