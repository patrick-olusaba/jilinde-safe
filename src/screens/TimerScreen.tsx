import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ui/ScreenHeader';
import InfoBox from '../components/ui/InfoBox';
import '../styles/TimerScreen.css';

const PRESETS = [15, 30, 45, 60];
const SCENARIOS = [
  { id: 'uber', label: 'Uber/Bolt', icon: '🚗' },
  { id: 'matatu', label: 'Matatu', icon: '🚌' },
  { id: 'date', label: 'Date night', icon: '🌙' },
  { id: 'walk', label: 'Night walk', icon: '🚶🏾' },
  { id: 'boda', label: 'Boda boda', icon: '🏍️' },
  { id: 'work', label: 'Late shift', icon: '🏢' },
];

const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

export default function TimerScreen() {
  const { state, setTimer, startTimer, stopTimer, addAlert } = useApp();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [progress, setProgress] = useState(1);

  // Tick down when active
  useEffect(() => {
    if (!state.timerActive || !state.timerEndTime) return;
    const tick = () => {
      const now = Date.now();
      const end = state.timerEndTime!.getTime();
      const left = Math.max(0, end - now);
      const total = state.timerMinutes * 60 * 1000;
      setRemaining(left);
      setProgress(left / total);
      if (left === 0) {
        stopTimer();
        addAlert({
          type: 'timer',
          message: 'Safe timer expired — SOS sent!',
          location: 'Nairobi CBD',
          timestamp: new Date(),
          resolved: false,
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [state.timerActive, state.timerEndTime]);

  const formatTime = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isDanger = remaining > 0 && remaining < 60_000;
  const dashOffset = CIRCUMFERENCE * (1 - (state.timerActive ? progress : 1));

  return (
    <div className="timer-screen">
      <ScreenHeader title="I'm Home Safe" subtitle="Auto-SOS if you don't check in before timer ends" />

      {/* Clock */}
      <div className="timer-clock-wrapper">
        <div className="timer-clock">
          <svg className="timer-clock__svg" viewBox="0 0 120 120">
            <circle className="timer-clock__track" cx="60" cy="60" r="52" />
            <circle
              className={`timer-clock__progress${isDanger ? ' danger' : ''}`}
              cx="60" cy="60" r="52"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="timer-clock__center">
            <span className="timer-clock__time">
              {state.timerActive
                ? formatTime(remaining)
                : `${state.timerMinutes}m`}
            </span>
            <span className="timer-clock__label">
              {state.timerActive ? (isDanger ? 'DANGER' : 'remaining') : 'set duration'}
            </span>
          </div>
        </div>

        <div className={`timer-status-badge ${state.timerActive ? (isDanger ? 'danger' : 'active') : 'idle'}`}>
          <span className={`status-dot${state.timerActive ? ' pulse' : ''}`} />
          {state.timerActive
            ? isDanger ? 'Sending SOS soon!' : 'Timer running'
            : 'Timer idle'}
        </div>
      </div>

      {/* Duration picker */}
      {!state.timerActive && (
        <div className="duration-card">
          <span className="duration-card__label">Set Duration</span>
          <div className="duration-presets">
            {PRESETS.map(p => (
              <button
                key={p}
                className={`duration-preset${state.timerMinutes === p ? ' selected' : ''}`}
                onClick={() => setTimer(p)}
              >
                {p}m
              </button>
            ))}
          </div>
          <div className="duration-custom">
            <span className="duration-custom__label">Custom:</span>
            <input
              type="range"
              className="duration-slider"
              min={5}
              max={120}
              step={5}
              value={state.timerMinutes}
              onChange={e => setTimer(Number(e.target.value))}
            />
            <span className="duration-custom__value">{state.timerMinutes}m</span>
          </div>
        </div>
      )}

      {/* Scenario */}
      {!state.timerActive && (
        <div className="scenario-section">
          <span className="scenario-label">What are you doing?</span>
          <div className="scenario-pills">
            {SCENARIOS.map(sc => (
              <button
                key={sc.id}
                className={`scenario-pill${selectedScenario === sc.id ? ' selected' : ''}`}
                onClick={() => setSelectedScenario(prev => prev === sc.id ? null : sc.id)}
              >
                <span className="scenario-pill__icon">{sc.icon}</span>
                {sc.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="timer-controls">
        {state.timerActive ? (
          <>
            <button className="timer-btn safe" onClick={stopTimer}>
              ✅ I'm Safe
            </button>
            <button className="timer-btn stop" onClick={stopTimer}>
              🛑 Stop Timer
            </button>
          </>
        ) : (
          <button className="timer-btn start full-width" onClick={startTimer}>
            ⏱️ Start Timer
          </button>
        )}
      </div>

      {/* Info */}
      <InfoBox>
        If you don't tap <strong>I'm Safe</strong> before the timer ends, your guardians are automatically alerted with your last known location — even if your phone is off.
      </InfoBox>
    </div>
  );
}
