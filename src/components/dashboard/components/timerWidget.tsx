'use client'

import { useState } from 'react'
import type { Activity } from '@/types'
import { useTimer } from '@/hooks/useTimer'
import { formatTimer } from '@/lib/helper'

type TimerHook = ReturnType<typeof useTimer>

interface Props {
  userId: string
  activities: Activity[]
  timer: TimerHook
  onSaved: () => void
}

export default function TimerWidget({ activities, timer, onSaved }: Props) {
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const { timerState, displaySeconds, start, pause, stop, reset, setActivity } = timer

  const selectedActivity = activities.find(a => a.id === timerState.activityId)
  const isRunning = timerState.isRunning

  async function handleStop() {
    setSaving(true)
    const id = await stop()
    setSaving(false)
    if (id) {
      setSavedMsg('Saved!')
      onSaved()
      setTimeout(() => setSavedMsg(''), 2000)
    }
  }

  function handleStartPause() {
    if (!timerState.activityId) return
    if (isRunning) {
      pause()
    } else {
      start(timerState.activityId)
    }
  }

  const canStart = !!timerState.activityId
  const hasTime = displaySeconds > 0

  return (
    <div className="glass-card" style={{
      padding: '32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow when running */}
      {isRunning && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(124,106,247,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
        {/* Timer display */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isRunning ? (
              <>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--green)', display: 'inline-block',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  boxShadow: '0 0 8px var(--green)',
                }} />
                Recording
              </>
            ) : hasTime ? 'Paused' : 'Timer'}
          </div>

          <div className="timer-display" style={{
            color: isRunning ? 'var(--text-primary)' : hasTime ? 'var(--yellow)' : 'var(--text-muted)',
            transition: 'color 0.3s',
          }}>
            {formatTimer(displaySeconds)}
          </div>

          {selectedActivity && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{selectedActivity.icon}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                {selectedActivity.name}
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-end' }}>
          {/* Activity selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end', maxWidth: '400px' }}>
            {activities.map(activity => (
              <button
                key={activity.id}
                onClick={() => {
                  setActivity(activity.id)
                  if (!isRunning) start(activity.id)
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '99px',
                  border: `1px solid ${timerState.activityId === activity.id ? activity.color : 'var(--border)'}`,
                  background: timerState.activityId === activity.id ? `${activity.color}20` : 'transparent',
                  color: timerState.activityId === activity.id ? activity.color : 'var(--text-secondary)',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <span>{activity.icon}</span>
                {activity.name}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {savedMsg && (
              <span style={{ fontSize: '0.85rem', color: 'var(--green)', fontWeight: '600' }}>
                {savedMsg}
              </span>
            )}

            {hasTime && !isRunning && (
              <button onClick={reset} style={{
                padding: '10px 16px', borderRadius: '10px',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: '600', fontSize: '0.85rem',
                transition: 'all 0.15s',
              }}>
                Reset
              </button>
            )}

            {hasTime && (
              <button onClick={handleStop} disabled={saving || isRunning} style={{
                padding: '10px 20px', borderRadius: '10px',
                border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                color: isRunning ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: isRunning ? 'default' : 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '0.85rem',
                transition: 'all 0.15s', opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            )}

            <button
              onClick={handleStartPause}
              disabled={!canStart}
              style={{
                padding: '12px 28px', borderRadius: '12px', border: 'none',
                background: isRunning ? 'var(--yellow)' : canStart ? 'var(--accent)' : 'var(--bg-elevated)',
                color: isRunning ? '#000' : canStart ? 'white' : 'var(--text-muted)',
                fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '0.9rem',
                cursor: canStart ? 'pointer' : 'default',
                transition: 'all 0.15s',
                minWidth: '100px',
              }}
            >
              {isRunning ? '⏸ Pause' : hasTime ? '▶ Resume' : '▶ Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
