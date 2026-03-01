import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { HourSegment } from './HourSegment';
import { QuoteDisplay } from './QuoteDisplay';
import { TornEdge } from './TornEdge';
import { DayRecord } from '../types';
import { useNavigate, useOutletContext } from 'react-router';
import { useSound } from '../hooks/useSound';

interface RootContext {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

interface TodayScreenProps {
  today: DayRecord;
  quoteIndex: number;
  streak: number;
  onTear: (id: number) => void;
  onUndoTear: (id: number) => void;
  onAddHours: (hoursToAdd: number) => void;
  onTaskChange: (id: number, task: string) => void;
}

function ConfettiBurst({ show }: { show: boolean }) {
  const pieces = useMemo(
    () => Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: (i * 17) % 100,
      delay: (i % 12) * 0.03,
      rotate: (i * 31) % 360,
      color: ['#AF875A', '#8B7355', '#D9B88A', '#C96D53'][i % 4],
    })),
    []
  );

  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-40">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -16, x: `${piece.left}%`, opacity: 1, rotate: piece.rotate, scale: 1 }}
          animate={{ y: '105%', opacity: 0, rotate: piece.rotate + 220, scale: 0.8 }}
          transition={{ duration: 1.4, delay: piece.delay, ease: 'easeOut' }}
          className="absolute top-0 w-2 h-3 rounded-[1px]"
          style={{ background: piece.color }}
        />
      ))}
    </div>
  );
}

export function TodayScreen({
  today,
  quoteIndex,
  streak,
  onTear,
  onUndoTear,
  onAddHours,
  onTaskChange,
}: TodayScreenProps) {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useOutletContext<RootContext>();
  const { playDrumroll } = useSound();
  const tornCount = today.segments.filter(s => s.torn).length;
  const totalCount = today.totalHours;
  const allDone = totalCount > 0 && tornCount === totalCount;
  const wasAllDone = useRef(false);

  useEffect(() => {
    if (allDone && !wasAllDone.current) {
      playDrumroll();
    }
    wasAllDone.current = allDone;
  }, [allDone, playDrumroll]);

  const colors = isDarkMode ? {
    bg: '#1C1917',
    card: '#2A2623',
    text: '#F5F0E8',
    muted: 'rgba(245,240,232,0.55)',
    subtle: 'rgba(245,240,232,0.2)',
    accent: '#AF875A',
  } : {
    bg: '#F5F0E8',
    card: '#FDFAF5',
    text: '#1C1917',
    muted: 'rgba(107, 94, 79, 0.5)',
    subtle: 'rgba(139, 115, 85, 0.15)',
    accent: '#8B7355',
  };

  const dateDisplay = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ background: colors.bg }}>
      <div
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div className="relative z-10 flex flex-col max-w-sm mx-auto w-full px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between pt-14 pb-6"
        >
          <div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                color: colors.muted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              {dateDisplay}
            </p>
            <h1
              style={{
                fontFamily: 'Lora, serif',
                fontSize: '24px',
                color: colors.text,
                fontWeight: 400,
                lineHeight: '1.2',
              }}
            >
              Today's Sheet
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(175, 135, 90, 0.18)' : 'rgba(139, 115, 85, 0.1)',
                  border: `1px solid ${colors.subtle}`,
                }}
              >
                <span style={{ fontSize: '12px' }}>🔥</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: colors.text }}>
                  {streak}
                </span>
              </div>
            )}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full transition-colors"
              style={{ background: isDarkMode ? 'rgba(245,240,232,0.12)' : 'rgba(139, 115, 85, 0.08)' }}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3" stroke="#F5F0E8" strokeWidth="1.5" />
                  <path d="M8 1V3M8 13V15M1 8H3M13 8H15" stroke="#F5F0E8" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 9.2A5.2 5.2 0 1 1 6.8 3 4.3 4.3 0 0 0 13 9.2Z" stroke="#8B7355" strokeWidth="1.5" />
                </svg>
              )}
            </button>
            <button
              onClick={() => navigate('/stats')}
              className="p-2 rounded-full transition-colors"
              style={{ background: isDarkMode ? 'rgba(245,240,232,0.12)' : 'rgba(139, 115, 85, 0.08)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="8" width="3" height="7" rx="1" fill={colors.accent} opacity="0.8" />
                <rect x="6.5" y="5" width="3" height="10" rx="1" fill={colors.accent} opacity="0.8" />
                <rect x="12" y="2" width="3" height="13" rx="1" fill={colors.accent} opacity="0.8" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full transition-colors"
              style={{ background: isDarkMode ? 'rgba(245,240,232,0.12)' : 'rgba(139, 115, 85, 0.08)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2.5" stroke={colors.accent} strokeWidth="1.5" opacity="0.8" />
                <path d="M8 1V3M8 13V15M1 8H3M13 8H15M2.93 2.93L4.34 4.34M11.66 11.66L13.07 13.07M13.07 2.93L11.66 4.34M4.34 11.66L2.93 13.07" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              </svg>
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <QuoteDisplay quoteIndex={quoteIndex} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="mb-6 relative"
        >
          <ConfettiBurst show={allDone} />
          <div
            className="rounded-t-[3px] overflow-hidden"
            style={{
              background: colors.card,
              boxShadow: isDarkMode
                ? '0 2px 16px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.04)'
                : '0 2px 16px rgba(28, 25, 23, 0.08), 0 1px 4px rgba(28, 25, 23, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            <div
              className="h-[3px]"
              style={{
                background: 'repeating-linear-gradient(to right, rgba(139,115,85,0.3) 0px, rgba(139,115,85,0.3) 6px, transparent 6px, transparent 12px)',
              }}
            />

            <div className="relative">
              <div className="absolute top-0 bottom-0 left-[48px] w-[1px]" style={{ background: isDarkMode ? 'rgba(195, 115, 115, 0.22)' : 'rgba(200, 100, 100, 0.15)' }} />
              <div>
                {today.segments.map((segment, i) => (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04, duration: 0.4 }}
                  >
                    <HourSegment
                      segment={segment}
                      index={i}
                      isLast={i === today.segments.length - 1}
                      onTear={onTear}
                      onUndoTear={onUndoTear}
                      onTaskChange={onTaskChange}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: colors.card }}>
            <TornEdge height={12} color={colors.bg} seed={42} position="bottom" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="pb-10 flex flex-col items-center gap-4"
        >
          <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: colors.subtle }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: colors.accent }}
              initial={{ width: '0%' }}
              animate={{ width: `${totalCount > 0 ? (tornCount / totalCount) * 100 : 0}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'Lora, serif', fontSize: '28px', color: colors.text, fontWeight: 400, lineHeight: '1' }}>
              {tornCount}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: colors.muted }}>
              / {totalCount} hours torn
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onAddHours(1)}
              className="px-4 py-2 rounded-xl"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: colors.text,
                background: isDarkMode ? 'rgba(245,240,232,0.08)' : 'rgba(139, 115, 85, 0.1)',
                border: `1px solid ${colors.subtle}`,
              }}
            >
              + Add 1 hour
            </button>
          </div>

          {allDone && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-center"
              style={{
                fontFamily: 'Lora, serif',
                fontStyle: 'italic',
                fontSize: '14px',
                color: isDarkMode ? '#D9B88A' : '#6B5E4F',
              }}
            >
              Sheet complete. You earned it.
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
