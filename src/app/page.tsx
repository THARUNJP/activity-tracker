"use client";
import { useEffect, useRef, useState } from "react";

export default function TimerUI() {
  const [count, setCount] = useState<number>(0);
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerOn) {
      intervalRef.current = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerOn]);

  function handleStart() {
    alert("the timer has started");
    setTimerOn(true);
  }
  function handlePause() {
    alert("the timer has paused");
    setTimerOn(false);
  }
   function handleReset() {
    alert("the timer has paused");
    setTimerOn(false);
    setCount(0)
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10 flex flex-col items-center gap-6 w-[320px]">
        {/* Title */}
        <h1 className="text-3xl font-semibold tracking-wide text-gray-200">
          Stopwatch
        </h1>

        {/* Timer Display */}
        <div className="text-6xl font-mono font-bold tracking-widest text-white drop-shadow-lg">
          {count}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 w-full mt-4">
          <button
            onClick={handleStart}
            className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-lg shadow-green-500/30 text-lg font-semibold"
          >
            Start
          </button>

          <button
            onClick={handlePause}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/30 text-lg font-semibold"
          >
            Pause
          </button>


           <button
            onClick={handleReset}
            className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 shadow-lg shadow-yellow-500/30 text-lg font-semibold"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
