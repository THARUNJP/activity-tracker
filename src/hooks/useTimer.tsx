"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TimerState } from "@/types";
import { createClient } from "@/supabase/client";
import { ulid } from "ulid";

const STORAGE_KEY = "activity-tracker-timer";

function loadTimerState(): TimerState {
  if (typeof window === "undefined")
    return { isRunning: false, startTime: null, elapsed: 0, activityId: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return {
        isRunning: false,
        startTime: null,
        elapsed: 0,
        activityId: null,
      };
    return JSON.parse(raw);
  } catch {
    return { isRunning: false, startTime: null, elapsed: 0, activityId: null };
  }
}

function saveTimerState(state: TimerState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearTimerState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function useTimer(userId: string | undefined) {
  const [timerState, setTimerState] = useState<TimerState>(() =>
    loadTimerState(),
  );
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supabase = createClient();

  // Compute display seconds from state
  const computeSeconds = useCallback((state: TimerState): number => {
    if (!state.isRunning || !state.startTime) {
      return state.elapsed;
    }
    return state.elapsed + Math.floor((Date.now() - state.startTime) / 1000);
  }, []);

  // Tick interval
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(() => {
        setDisplaySeconds(computeSeconds(timerState));
      }, 1000);
    } else {
      setDisplaySeconds(computeSeconds(timerState));
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState, computeSeconds]);

  const start = useCallback(
    (activityId: string) => {
      const newState: TimerState = {
        isRunning: true,
        startTime: Date.now(),
        elapsed: timerState.elapsed,
        activityId,
      };
      setTimerState(newState);
      saveTimerState(newState);
    },
    [timerState.elapsed],
  );

  const pause = useCallback(async () => {
    if (!timerState.isRunning || !timerState.startTime) return;
    const additionalSeconds = Math.floor(
      (Date.now() - timerState.startTime) / 1000,
    );
    const newElapsed = timerState.elapsed + additionalSeconds;

    const newState: TimerState = {
      isRunning: false,
      startTime: null,
      elapsed: newElapsed,
      activityId: timerState.activityId,
    };
    setTimerState(newState);
    saveTimerState(newState);
  }, [timerState]);

  const stop = useCallback(async (): Promise<{
    id: string | null;
    error: string | null;
    skippedShort: boolean;
  }> => {
    if (!userId || !timerState.activityId)
      return { id: null, error: "No activity selected", skippedShort: false };

    const now = new Date();
    let startTime: Date;
    let durationSeconds: number;

    if (timerState.isRunning && timerState.startTime) {
      const additionalSeconds = Math.floor(
        (Date.now() - timerState.startTime) / 1000,
      );
      durationSeconds = timerState.elapsed + additionalSeconds;
      startTime = new Date(timerState.startTime - timerState.elapsed * 1000);
    } else {
      durationSeconds = timerState.elapsed;
      startTime = new Date(now.getTime() - durationSeconds * 1000);
    }

    const resetState: TimerState = {
      isRunning: false,
      startTime: null,
      elapsed: 0,
      activityId: null,
    };

    if (durationSeconds < 5) {
      setTimerState(resetState);
      clearTimerState();
      return { id: null, error: null, skippedShort: true };
    }

    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        id: ulid(),
        user_id: userId,
        activity_id: timerState.activityId,
        start_time: startTime.toISOString(),
        end_time: now.toISOString(),
        source: "manual",
      })
      .select()
      .single();

    if (error || !data) {
      return { id: null, error: error?.message || "Save failed", skippedShort: false };
    }

    setTimerState(resetState);
    clearTimerState();
    return { id: data.id, error: null, skippedShort: false };
  }, [timerState, userId, supabase]);

  const reset = useCallback(() => {
    const resetState: TimerState = {
      isRunning: false,
      startTime: null,
      elapsed: 0,
      activityId: null,
    };
    setTimerState(resetState);
    clearTimerState();
  }, []);

  const setActivity = useCallback(
    (activityId: string) => {
      const newState = { ...timerState, activityId };
      setTimerState(newState);
      saveTimerState(newState);
    },
    [timerState],
  );

  return {
    timerState,
    displaySeconds,
    start,
    pause,
    stop,
    reset,
    setActivity,
  };
}
