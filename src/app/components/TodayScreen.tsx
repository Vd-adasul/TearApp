import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { HourSegment } from './HourSegment';
import { QuoteDisplay } from './QuoteDisplay';
import { TornEdge } from './TornEdge';
import { DayRecord } from '../types';
import { useNavigate } from 'react-router';

interface TodayScreenProps {
  today: DayRecord;
  quoteIndex: number;
  motivationPhoto: string | null;
  streak: number;
  onTear: (id: number) => void;
  onTaskChange: (id: number, task: string) => void;
}

export function TodayScreen({
  today,
  quoteIndex,
  motivationPhoto,
  streak,
  onTear,
  onTaskChange,
}: TodayScreenProps) {
  const navigate = useNavigate();
  const tornCount = today.segments.filter(s => s.torn).length;
  const totalCount = today.totalHours;
  const allDone = tornCount === totalCount;

  const dateDisplay = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F5F0E8' }}
    >
      {/* Paper grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Memory photo - very faint behind content */}
      {motivationPhoto && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${motivationPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.04,
            filter: 'saturate(0.3) blur(2px)',
          }}
        />
      )}

      <div className="relative z-10 flex flex-col max-w-sm mx-auto w-full px-4 pb-10">
        {/* Header */}
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
                color: 'rgba(107, 94, 79, 0.45)',
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
                color: '#1C1917',
                fontWeight: 400,
                lineHeight: '1.2',
              }}
            >
              Today's Sheet
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(139, 115, 85, 0.1)',
                  border: '1px solid rgba(139, 115, 85, 0.15)',
                }}
              >
                <span style={{ fontSize: '12px' }}>🔥</span>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: '#6B5E4F',
                  }}
                >
                  {streak}
                </span>
              </div>
            )}
            <button
              onClick={() => navigate('/stats')}
              className="p-2 rounded-full transition-colors"
              style={{ background: 'rgba(139, 115, 85, 0.08)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="8" width="3" height="7" rx="1" fill="#8B7355" opacity="0.7" />
                <rect x="6.5" y="5" width="3" height="10" rx="1" fill="#8B7355" opacity="0.7" />
                <rect x="12" y="2" width="3" height="13" rx="1" fill="#8B7355" opacity="0.7" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full transition-colors"
              style={{ background: 'rgba(139, 115, 85, 0.08)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2.5" stroke="#8B7355" strokeWidth="1.5" opacity="0.7" />
                <path d="M8 1V3M8 13V15M1 8H3M13 8H15M2.93 2.93L4.34 4.34M11.66 11.66L13.07 13.07M13.07 2.93L11.66 4.34M4.34 11.66L2.93 13.07" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <QuoteDisplay quoteIndex={quoteIndex} />
        </motion.div>

        {/* Paper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="mb-6"
        >
          {/* Paper top edge */}
          <div
            className="rounded-t-[3px] overflow-hidden"
            style={{
              background: '#FDFAF5',
              boxShadow: '0 2px 16px rgba(28, 25, 23, 0.08), 0 1px 4px rgba(28, 25, 23, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Paper top binding line */}
            <div
              className="h-[3px]"
              style={{
                background: 'repeating-linear-gradient(to right, rgba(139,115,85,0.3) 0px, rgba(139,115,85,0.3) 6px, transparent 6px, transparent 12px)',
              }}
            />

            {/* Left margin line */}
            <div className="relative">
              <div
                className="absolute top-0 bottom-0 left-[48px] w-[1px]"
                style={{ background: 'rgba(200, 100, 100, 0.15)' }}
              />

              {/* Segments */}
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
                      onTaskChange={onTaskChange}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Paper bottom torn edge */}
          <div style={{ background: '#FDFAF5' }}>
            <TornEdge height={12} color="#F5F0E8" seed={42} position="bottom" />
          </div>
        </motion.div>

        {/* Footer progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="pb-10 flex flex-col items-center gap-4"
        >
          {/* Progress bar */}
          <div
            className="w-full h-[2px] rounded-full overflow-hidden"
            style={{ background: 'rgba(139, 115, 85, 0.15)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#8B7355' }}
              initial={{ width: '0%' }}
              animate={{ width: `${totalCount > 0 ? (tornCount / totalCount) * 100 : 0}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Count */}
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: 'Lora, serif',
                fontSize: '28px',
                color: '#1C1917',
                fontWeight: 400,
                lineHeight: '1',
              }}
            >
              {tornCount}
            </span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#A89880',
              }}
            >
              / {totalCount} hours torn
            </span>
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
                color: '#6B5E4F',
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