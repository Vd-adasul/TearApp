import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useOutletContext } from 'react-router';

interface SetupScreenProps {
  onSetup: (hours: number) => void;
}

interface RootContext {
  isDarkMode: boolean;
}

const HOUR_OPTIONS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const DEFAULT_HOURS = 8;

export function SetupScreen({ onSetup }: SetupScreenProps) {
  const [selected, setSelected] = useState(DEFAULT_HOURS);
  const { isDarkMode } = useOutletContext<RootContext>();

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const colors = isDarkMode ? {
    bg: '#1C1917',
    text: '#F5F0E8',
    muted: 'rgba(245,240,232,0.6)',
    pill: 'rgba(245,240,232,0.08)',
    selected: '#AF875A',
    border: 'rgba(245,240,232,0.16)',
  } : {
    bg: '#F5F0E8',
    text: '#1C1917',
    muted: 'rgba(107, 94, 79, 0.5)',
    pill: 'rgba(139, 115, 85, 0.1)',
    selected: '#1C1917',
    border: 'rgba(139, 115, 85, 0.2)',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: colors.bg }}>
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-sm flex flex-col items-center gap-10"
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="mb-2">
            <TearLogo isDarkMode={isDarkMode} />
          </motion.div>
          <p
            className="text-center"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              color: colors.muted,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {dayName} · {dateStr}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', color: colors.text, lineHeight: '1.4', fontWeight: 400 }}>
            How many hours will you
            <br />
            <em>commit today?</em>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: colors.muted }}>
            Each hour is a promise to yourself.
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <motion.div
            key={selected}
            initial={{ opacity: 0.5, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-end gap-2"
          >
            <span style={{ fontFamily: 'Lora, serif', fontSize: '80px', color: colors.text, lineHeight: '1', fontWeight: 400 }}>
              {selected}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: colors.muted, paddingBottom: '14px' }}>
              hrs
            </span>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 w-full">
            {HOUR_OPTIONS.map(h => (
              <motion.button
                key={h}
                onClick={() => setSelected(h)}
                whileTap={{ scale: 0.92 }}
                className="px-4 py-2 rounded-full transition-all duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  background: selected === h ? colors.selected : colors.pill,
                  color: selected === h ? '#F5F0E8' : colors.text,
                  border: selected === h ? 'none' : `1px solid ${colors.border}`,
                  fontWeight: selected === h ? 500 : 400,
                }}
              >
                {h}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={() => onSetup(selected)}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="w-full py-4 rounded-2xl relative overflow-hidden"
          style={{
            background: colors.selected,
            color: '#F5F0E8',
            fontFamily: 'Lora, serif',
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '0.03em',
            boxShadow: '0 8px 32px rgba(28, 25, 23, 0.2)',
          }}
        >
          Begin the day
          <span className="ml-2 opacity-50" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
            ↗
          </span>
        </motion.button>

        <p className="text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: colors.muted }}>
          Tears at midnight. Starts fresh.
        </p>
      </motion.div>
    </div>
  );
}

function TearLogo({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span
        style={{
          fontFamily: 'Lora, serif',
          fontSize: '32px',
          color: isDarkMode ? '#F5F0E8' : '#1C1917',
          letterSpacing: '-0.02em',
          fontWeight: 400,
        }}
      >
        tear
      </span>
      <svg width="8" height="28" viewBox="0 0 8 28" fill="none" className="mt-0.5">
        <path
          d="M4 0 C4 0 1 4 2 8 C3 12 6 14 5 18 C4 22 2 24 4 28"
          stroke={isDarkMode ? '#D9B88A' : '#8B7355'}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
