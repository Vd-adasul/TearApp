import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useOutletContext } from 'react-router';
import { DayRecord } from '../types';
import { TornEdge } from './TornEdge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

interface RootContext {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

interface StatsScreenProps {
  today: DayRecord | null;
  history: DayRecord[];
  streak: number;
  weeklyTotal: number;
}

function TornPaperThumbnail({ record, isDarkMode }: { record: DayRecord; isDarkMode: boolean }) {
  const torn = record.segments.filter(s => s.torn).length;
  const total = record.totalHours;
  const date = new Date(record.date + 'T12:00:00');
  const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="flex flex-col" style={{ width: '80px' }}>
      <div
        className="rounded-t-[2px] overflow-hidden"
        style={{
          background: isDarkMode ? '#2A2623' : '#FDFAF5',
          boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(28, 25, 23, 0.08)',
          height: '90px',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '3px',
            background: 'repeating-linear-gradient(to right, rgba(139,115,85,0.3) 0px, rgba(139,115,85,0.3) 4px, transparent 4px, transparent 8px)',
          }}
        />
        <div className="flex flex-col gap-0 p-1 pt-2">
          {record.segments.map(seg => (
            <div
              key={seg.id}
              style={{
                height: '6px',
                margin: '1px 2px',
                background: seg.torn
                  ? 'rgba(175, 135, 90, 0.28)'
                  : isDarkMode ? 'rgba(245,240,232,0.08)' : 'rgba(28, 25, 23, 0.06)',
                borderRadius: '1px',
                position: 'relative',
                overflow: 'hidden',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ background: isDarkMode ? '#2A2623' : '#FDFAF5' }}>
        <TornEdge height={5} color={isDarkMode ? '#1C1917' : '#F5F0E8'} seed={record.segments.length + 1} position="bottom" />
      </div>
      <div className="mt-1 text-center">
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: isDarkMode ? '#E7DED1' : '#6B5E4F', fontWeight: 500 }}>
          {dayStr}
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', color: isDarkMode ? '#B8AA99' : '#A89880' }}>
          {torn}/{total}
        </p>
      </div>
    </div>
  );
}

export function StatsScreen({ today, history, streak, weeklyTotal }: StatsScreenProps) {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useOutletContext<RootContext>();
  const [selectedRecord, setSelectedRecord] = useState<DayRecord | null>(null);

  const todayTorn = today?.segments.filter(s => s.torn).length ?? 0;
  const todayTotal = today?.totalHours ?? 0;
  const allRecords = useMemo(() => (today ? [today, ...history] : history), [today, history]);

  const colors = isDarkMode ? {
    bg: '#1C1917',
    card: '#2A2623',
    text: '#F5F0E8',
    muted: 'rgba(245,240,232,0.6)',
    subtle: 'rgba(245,240,232,0.12)',
    accent: '#AF875A',
  } : {
    bg: '#F5F0E8',
    card: '#FDFAF5',
    text: '#1C1917',
    muted: '#A89880',
    subtle: 'rgba(139,115,85,0.2)',
    accent: '#8B7355',
  };

  const chartData = useMemo(() => {
    return [...allRecords]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14)
      .map((record) => {
        const torn = record.segments.filter(s => s.torn).length;
        return {
          date: record.date.slice(5),
          torn,
          target: record.totalHours,
          completion: record.totalHours > 0 ? Math.round((torn / record.totalHours) * 100) : 0,
        };
      });
  }, [allRecords]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ background: colors.bg }}>
      <div
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div className="relative z-10 max-w-sm mx-auto w-full px-4">
        <div className="flex items-center gap-3 pt-14 pb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full"
            style={{ background: isDarkMode ? 'rgba(245,240,232,0.12)' : 'rgba(139, 115, 85, 0.1)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '24px', color: colors.text, fontWeight: 400 }}>
            Your Progress
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="ml-auto p-2 rounded-full"
            style={{ background: isDarkMode ? 'rgba(245,240,232,0.12)' : 'rgba(139, 115, 85, 0.1)' }}
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
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-3 gap-3 mb-6">
          <StatCard value={todayTorn} label="today" sub={`of ${todayTotal}`} accent={todayTorn === todayTotal && todayTotal > 0} isDarkMode={isDarkMode} />
          <StatCard value={weeklyTotal} label="this week" sub="hours" isDarkMode={isDarkMode} />
          <StatCard value={streak} label="streak" sub="days" emoji={streak >= 3 ? '🔥' : undefined} isDarkMode={isDarkMode} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }} className="mb-6">
          <div className="rounded-2xl p-4" style={{ background: colors.card, boxShadow: isDarkMode ? '0 2px 12px rgba(0,0,0,0.35)' : '0 2px 12px rgba(28,25,23,0.08)' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Hours Trend (14 Days)
            </p>
            <div style={{ width: '100%', height: 170 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(245,240,232,0.08)' : 'rgba(139,115,85,0.15)'} />
                  <XAxis dataKey="date" tick={{ fill: isDarkMode ? '#B8AA99' : '#8B7355', fontSize: 10 }} />
                  <YAxis tick={{ fill: isDarkMode ? '#B8AA99' : '#8B7355', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: colors.card, border: `1px solid ${colors.subtle}`, borderRadius: 8 }}
                    labelStyle={{ color: colors.text }}
                  />
                  <Line type="monotone" dataKey="torn" stroke={colors.accent} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="target" stroke={isDarkMode ? '#E7DED1' : '#6B5E4F'} strokeWidth={1.6} strokeDasharray="4 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.4 }} className="mb-8">
          <div className="rounded-2xl p-4" style={{ background: colors.card, boxShadow: isDarkMode ? '0 2px 12px rgba(0,0,0,0.35)' : '0 2px 12px rgba(28,25,23,0.08)' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Completion %
            </p>
            <div style={{ width: '100%', height: 140 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(245,240,232,0.08)' : 'rgba(139,115,85,0.15)'} />
                  <XAxis dataKey="date" tick={{ fill: isDarkMode ? '#B8AA99' : '#8B7355', fontSize: 10 }} />
                  <YAxis tick={{ fill: isDarkMode ? '#B8AA99' : '#8B7355', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: colors.card, border: `1px solid ${colors.subtle}`, borderRadius: 8 }} />
                  <Bar dataKey="completion" fill={colors.accent} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <p className="mb-4" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: colors.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Past Sheets
          </p>

          {allRecords.length === 0 ? (
            <div className="text-center py-16">
              <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: '15px', color: colors.muted }}>
                No sheets yet.
                <br />
                Your history will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 pb-24">
              {allRecords.map((record, i) => (
                <motion.button
                  key={`${record.date}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.4 }}
                  onClick={() => setSelectedRecord(record)}
                  className="text-left"
                >
                  <TornPaperThumbnail record={record} isDarkMode={isDarkMode} />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[80vh] overflow-auto" style={{ background: colors.card }}>
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '20px', color: colors.text }}>
                {new Date(selectedRecord.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
              <button onClick={() => setSelectedRecord(null)} style={{ color: colors.muted, fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
                close
              </button>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: colors.muted, marginBottom: '10px' }}>
              {selectedRecord.segments.filter(s => s.torn).length}/{selectedRecord.totalHours} hours completed
            </p>
            <div className="flex flex-col gap-2">
              {selectedRecord.segments.map((seg) => (
                <div key={seg.id} className="rounded-lg px-3 py-2 flex items-center gap-3" style={{ background: isDarkMode ? 'rgba(245,240,232,0.05)' : 'rgba(139,115,85,0.08)' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: colors.muted, width: '22px' }}>
                    {String(seg.id).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: 'Caveat, cursive', fontSize: '19px', color: colors.text, flex: 1 }}>
                    {seg.task || '(No label)'}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: seg.torn ? '#5FA36A' : colors.muted }}>
                    {seg.torn ? 'done' : 'pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  value,
  label,
  sub,
  accent = false,
  emoji,
  isDarkMode,
}: {
  value: number;
  label: string;
  sub: string;
  accent?: boolean;
  emoji?: string;
  isDarkMode: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-1"
      style={{
        background: accent ? '#AF875A' : (isDarkMode ? '#2A2623' : '#FDFAF5'),
        boxShadow: isDarkMode ? '0 2px 12px rgba(0,0,0,0.35)' : '0 2px 12px rgba(28, 25, 23, 0.07)',
      }}
    >
      <div className="flex items-center gap-1">
        {emoji && <span style={{ fontSize: '14px' }}>{emoji}</span>}
        <span
          style={{
            fontFamily: 'Lora, serif',
            fontSize: '28px',
            color: accent ? '#F5F0E8' : (isDarkMode ? '#F5F0E8' : '#1C1917'),
            lineHeight: '1',
            fontWeight: 400,
          }}
        >
          {value}
        </span>
      </div>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          color: accent ? 'rgba(245,240,232,0.8)' : (isDarkMode ? '#B8AA99' : '#A89880'),
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          color: accent ? 'rgba(245,240,232,0.7)' : (isDarkMode ? 'rgba(245,240,232,0.5)' : 'rgba(168,152,128,0.6)'),
        }}
      >
        {sub}
      </span>
    </div>
  );
}
