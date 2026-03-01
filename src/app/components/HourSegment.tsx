import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TornEdge } from './TornEdge';
import { Segment } from '../types';
import { useSound } from '../hooks/useSound';

interface HourSegmentProps {
  segment: Segment;
  index: number;
  isLast: boolean;
  onTear: (id: number) => void;
  onUndoTear: (id: number) => void;
  onTaskChange: (id: number, task: string) => void;
}

const SWIPE_THRESHOLD = 0.42;
const MIN_HORIZONTAL_RATIO = 1.5;

const TASK_SUGGESTIONS = [
  'Deep Work', 'DSA', 'ML', 'Reading', 'Exercise',
  'Project', 'Revision', 'Research', 'Writing', 'Study',
  'Code', 'Design', 'Practice', 'Focus', 'Planning',
];

export function HourSegment({ segment, index, isLast, onTear, onUndoTear, onTaskChange }: HourSegmentProps) {
  const { playTear } = useSound();
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isTearing, setIsTearing] = useState(false);
  const [tearDir, setTearDir] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(segment.task);

  const dragRef = useRef({ startX: 0, startY: 0, width: 0, dir: 1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerTear = useCallback((dir: number) => {
    setTearDir(dir);
    setIsTearing(true);
    setIsDragging(false);
    setDragProgress(0);
    playTear();
    try { navigator.vibrate?.(35); } catch { }
  }, [playTear]);

  const shouldIgnoreGesture = (target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    return Boolean(el?.closest('[data-no-swipe="true"]'));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (segment.torn || isTearing || isEditing) return;
    if (shouldIgnoreGesture(e.target)) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      width: containerRef.current?.offsetWidth ?? 320,
      dir: 1,
    };
    setIsDragging(true);
    setDragProgress(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || segment.torn || isTearing) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = Math.abs(e.clientY - dragRef.current.startY);
    if (Math.abs(dx) < dy * MIN_HORIZONTAL_RATIO) return;
    dragRef.current.dir = dx >= 0 ? 1 : -1;
    setDragProgress(Math.max(0, Math.min(1, Math.abs(dx) / dragRef.current.width)));
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    if (dragProgress >= SWIPE_THRESHOLD) {
      triggerTear(dragRef.current.dir);
    } else {
      setIsDragging(false);
      setDragProgress(0);
    }
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragProgress(0);
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    if (segment.torn || isTearing) return;
    e.stopPropagation();
    setIsEditing(true);
    setShowSuggestions(true);
    setInputValue(segment.task);
    setTimeout(() => inputRef.current?.focus(), 20);
  };

  const commitTask = () => {
    onTaskChange(segment.id, inputValue.trim());
    setIsEditing(false);
    setShowSuggestions(false);
  };

  const pct = dragProgress * 100;
  const hourLabel = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={containerRef}
      className="relative overflow-visible select-none"
      style={{ touchAction: 'pan-y' }}
    >
      <AnimatePresence mode="sync">
        {!segment.torn && (
          <motion.div
            key="paper"
            animate={isTearing ? {
              x: tearDir > 0 ? '120%' : '-120%',
              rotate: tearDir * 4,
              opacity: 0,
            } : { x: 0, rotate: 0, opacity: 1 }}
            transition={isTearing
              ? { duration: 0.42, ease: [0.55, 0, 0.9, 0.5] }
              : { duration: 0 }}
            style={{ transformOrigin: tearDir > 0 ? '5% 50%' : '95% 50%', cursor: isEditing ? 'text' : 'grab' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onAnimationComplete={() => {
              if (isTearing) {
                onTear(segment.id);
                setIsTearing(false);
              }
            }}
            className="relative overflow-hidden"
          >
            {isDragging && dragProgress > 0 && (
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background: dragRef.current.dir > 0
                    ? `linear-gradient(to right, rgba(175,135,90,0.14) ${pct}%, transparent ${pct}%)`
                    : `linear-gradient(to left, rgba(175,135,90,0.14) ${pct}%, transparent ${pct}%)`,
                }}
              />
            )}

            {isDragging && dragProgress > 0.08 && (
              <div
                className="absolute top-0 bottom-0 z-30 pointer-events-none"
                style={{
                  width: '1.5px',
                  left: dragRef.current.dir > 0 ? `${pct}%` : `${100 - pct}%`,
                  background: 'repeating-linear-gradient(to bottom, rgba(107,66,38,0.45) 0px, rgba(107,66,38,0.45) 3px, transparent 3px, transparent 8px)',
                }}
              />
            )}

            <div
              className="flex items-center px-5 relative z-10"
              style={{
                minHeight: '72px',
                borderBottom: isLast ? 'none' : '1px solid rgba(139, 115, 85, 0.1)',
              }}
            >
              <span
                className="shrink-0 mr-4"
                style={{
                  fontFamily: 'Lora, serif',
                  fontSize: '11px',
                  color: '#B8AA99',
                  letterSpacing: '0.04em',
                  minWidth: '22px',
                }}
              >
                {hourLabel}
              </span>

              <div className="flex-1 min-w-0 relative z-20" data-no-swipe="true">
                {isEditing ? (
                  <>
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onBlur={commitTask}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitTask();
                        if (e.key === 'Escape') {
                          setIsEditing(false);
                          setShowSuggestions(false);
                        }
                      }}
                      maxLength={24}
                      placeholder="label this hour..."
                      className="w-full bg-transparent outline-none border-none"
                      style={{
                        fontFamily: 'Caveat, cursive',
                        fontSize: '19px',
                        color: '#3D2B1F',
                        caretColor: '#8B6340',
                        borderBottom: '1px solid rgba(139, 115, 85, 0.35)',
                        paddingBottom: '2px',
                      }}
                    />
                    {showSuggestions && (
                      <div
                        className="absolute top-full left-0 mt-2 z-50 flex flex-wrap gap-1.5"
                        style={{ maxWidth: '240px' }}
                        onMouseDown={e => e.preventDefault()}
                      >
                        {TASK_SUGGESTIONS.filter(s =>
                          inputValue === '' || s.toLowerCase().startsWith(inputValue.toLowerCase())
                        ).slice(0, 8).map(s => (
                          <button
                            key={s}
                            onClick={() => {
                              setInputValue(s);
                              onTaskChange(segment.id, s);
                              setIsEditing(false);
                              setShowSuggestions(false);
                            }}
                            className="px-2.5 py-1 rounded-full"
                            style={{
                              background: '#FDFAF5',
                              color: '#6B5E4F',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '11px',
                              border: '1px solid rgba(139, 115, 85, 0.2)',
                              boxShadow: '0 1px 4px rgba(28, 25, 23, 0.08)',
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div onClick={handleLabelClick} className="py-1 cursor-text">
                    {segment.task ? (
                      <span style={{ fontFamily: 'Caveat, cursive', fontSize: '19px', color: '#3D2B1F' }}>
                        {segment.task}
                      </span>
                    ) : (
                      <span style={{ fontFamily: 'Caveat, cursive', fontSize: '17px', color: 'rgba(139, 115, 85, 0.28)' }}>
                        tap to label...
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isEditing && !isTearing && (
                <div
                  className="shrink-0 ml-3 transition-opacity duration-200"
                  style={{ opacity: isDragging ? 0 : 0.2 }}
                >
                  <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                    <path d="M2 6H20" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
                    <path d="M14 2L20 6L14 10" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {segment.torn && (
          <motion.div
            key="torn"
            initial={{ opacity: 0, scaleY: 0.88 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{ transformOrigin: 'top center' }}
          >
            <TornEdge height={7} color="#F5F0E8" seed={segment.id * 17 + 5} position="top" />
            <div
              className="flex items-center px-5"
              style={{
                minHeight: '46px',
                background: 'rgba(210, 200, 185, 0.3)',
                borderBottom: isLast ? 'none' : '1px solid rgba(139, 115, 85, 0.07)',
              }}
            >
              <span
                className="shrink-0 mr-4"
                style={{ fontFamily: 'Lora, serif', fontSize: '11px', color: '#C8BCA8', minWidth: '22px' }}
              >
                {hourLabel}
              </span>
              <span
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: '17px',
                  color: '#B8AA99',
                  textDecoration: 'line-through',
                  textDecorationColor: 'rgba(168, 152, 128, 0.4)',
                  flex: 1,
                }}
              >
                {segment.task || '-'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUndoTear(segment.id);
                }}
                className="ml-3 px-2 py-1 rounded-full"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  color: '#6B5E4F',
                  border: '1px solid rgba(139,115,85,0.25)',
                  background: '#FDFAF5',
                }}
              >
                undo
              </button>
            </div>
            <TornEdge height={7} color="#F5F0E8" seed={segment.id * 11 + 2} position="bottom" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
