import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { DayRecord } from '../types';
import { TornEdge } from './TornEdge';

interface StatsScreenProps {
  today: DayRecord | null;
  history: DayRecord[];
  streak: number;
  weeklyTotal: number;
}

function TornPaperThumbnail({ record }: { record: DayRecord }) {
  const torn = record.segments.filter(s => s.torn).length;
  const total = record.totalHours;
  const pct = torn / total;
  const date = new Date(record.date + 'T12:00:00');
  const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const isComplete = torn === total;

  return (
    <div className="flex flex-col" style={{ width: '80px' }}>
      {/* Paper thumbnail */}
      <div
        className="rounded-t-[2px] overflow-hidden"
        style={{
          background: '#FDFAF5',
          boxShadow: '0 2px 8px rgba(28, 25, 23, 0.08)',
          height: '90px',
          position: 'relative',
        }}
      >
        {/* Top binding */}
        <div
          style={{
            height: '3px',
            background: 'repeating-linear-gradient(to right, rgba(139,115,85,0.3) 0px, rgba(139,115,85,0.3) 4px, transparent 4px, transparent 8px)',
          }}
        />
        {/* Segments visualization */}
        <div className="flex flex-col gap-0 p-1 pt-2">
          {record.segments.map(seg => (
            <div
              key={seg.id}
              style={{
                height: '6px',
                margin: '1px 2px',
                background: seg.torn
                  ? 'rgba(139, 115, 85, 0.2)'
                  : 'rgba(28, 25, 23, 0.06)',
                borderRadius: '1px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {seg.torn && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'repeating-linear-gradient(45deg, rgba(139,115,85,0.3) 0px, rgba(139,115,85,0.3) 1px, transparent 1px, transparent 3px)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Completion badge */}
        {isComplete && (
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              right: '6px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#1C1917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '9px', color: '#F5F0E8' }}>✓</span>
          </div>
        )}
      </div>

      {/* Torn edge */}
      <div style={{ background: '#FDFAF5' }}>
        <TornEdge height={5} color="#F5F0E8" seed={record.segments.length + 1} position="bottom" />
      </div>

      {/* Label */}
      <div className="mt-1 text-center">
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            color: '#6B5E4F',
            fontWeight: 500,
          }}
        >
          {dayStr}
        </p>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px',
            color: '#A89880',
          }}
        >
          {torn}/{total}
        </p>
      </div>
    </div>
  );
}

export function StatsScreen({ today, history, streak, weeklyTotal }: StatsScreenProps) {
  const navigate = useNavigate();

  const todayTorn = today?.segments.filter(s => s.torn).length ?? 0;
  const todayTotal = today?.totalHours ?? 0;

  const allRecords = today ? [today, ...history] : history;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F5F0E8' }}
    >
      {/* Paper grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div className="relative z-10 max-w-sm mx-auto w-full px-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-14 pb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full"
            style={{ background: 'rgba(139, 115, 85, 0.1)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '24px',
              color: '#1C1917',
              fontWeight: 400,
            }}
          >
            Your Progress
          </h1>
        </div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <StatCard
            value={todayTorn}
            label="today"
            sub={`of ${todayTotal}`}
            accent={todayTorn === todayTotal && todayTotal > 0}
          />
          <StatCard
            value={weeklyTotal}
            label="this week"
            sub="hours"
          />
          <StatCard
            value={streak}
            label="streak"
            sub="days"
            emoji={streak >= 3 ? '🔥' : undefined}
          />
        </motion.div>

        {/* History heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p
            className="mb-4"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: 'rgba(107, 94, 79, 0.45)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Past Sheets
          </p>

          {allRecords.length === 0 ? (
            <div
              className="text-center py-16"
            >
              <p
                style={{
                  fontFamily: 'Lora, serif',
                  fontStyle: 'italic',
                  fontSize: '15px',
                  color: 'rgba(107, 94, 79, 0.4)',
                }}
              >
                No sheets yet.
                <br />
                Your history will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 pb-24">
              {allRecords.map((record, i) => (
                <motion.div
                  key={record.date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.4 }}
                >
                  <TornPaperThumbnail record={record} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  sub,
  accent = false,
  emoji,
}: {
  value: number;
  label: string;
  sub: string;
  accent?: boolean;
  emoji?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-1"
      style={{
        background: accent ? '#1C1917' : '#FDFAF5',
        boxShadow: '0 2px 12px rgba(28, 25, 23, 0.07)',
      }}
    >
      <div className="flex items-center gap-1">
        {emoji && <span style={{ fontSize: '14px' }}>{emoji}</span>}
        <span
          style={{
            fontFamily: 'Lora, serif',
            fontSize: '28px',
            color: accent ? '#F5F0E8' : '#1C1917',
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
          color: accent ? 'rgba(245,240,232,0.6)' : '#A89880',
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
          color: accent ? 'rgba(245,240,232,0.4)' : 'rgba(168,152,128,0.6)',
        }}
      >
        {sub}
      </span>
    </div>
  );
}
