import { useState, useCallback } from 'react';
import { AppData, DayRecord, Segment } from '../types';

const STORAGE_KEY = 'tear_app_data';

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getDefaultData(): AppData {
  return {
    today: null,
    history: [],
    streak: 0,
    lastQuoteIndex: Math.floor(Math.random() * 50),
  };
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw) as Partial<AppData> & { motivationPhoto?: string | null };
    return {
      today: parsed.today ?? null,
      history: parsed.history ?? [],
      streak: parsed.streak ?? 0,
      lastQuoteIndex: parsed.lastQuoteIndex ?? Math.floor(Math.random() * 50),
    };
  } catch {
    return getDefaultData();
  }
}

function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function calculateStreak(history: DayRecord[], todayDate: string): number {
  if (history.length === 0) return 0;
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(todayDate);
    expected.setDate(expected.getDate() - (i + 1));
    const expectedStr = expected.toISOString().split('T')[0];
    const record = sorted[i];
    if (record.date !== expectedStr) break;
    const completedCount = record.segments.filter((s: Segment) => s.torn).length;
    if (completedCount < record.totalHours) break;
    streak++;
  }
  return streak;
}

function initData(): AppData {
  const loaded = loadData();
  const today = getTodayDate();

  // If today's record is from a different day, archive it and reset
  if (loaded.today && loaded.today.date !== today) {
    const newHistory = [loaded.today, ...loaded.history].slice(0, 60);
    const streak = calculateStreak(newHistory, today);
    const resetData: AppData = {
      ...loaded,
      today: null,
      history: newHistory,
      streak,
    };
    saveData(resetData);
    return resetData;
  }
  return loaded;
}

export function useAppData() {
  const [data, setData] = useState<AppData>(initData);

  const mutate = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const setupToday = useCallback((totalHours: number) => {
    const today = getTodayDate();
    const segments: Segment[] = Array.from({ length: totalHours }, (_, i) => ({
      id: i + 1,
      task: '',
      torn: false,
      tornAt: null,
    }));
    mutate(prev => ({
      ...prev,
      today: { date: today, totalHours, segments },
      lastQuoteIndex: Math.floor(Math.random() * 50),
    }));
  }, [mutate]);

  const tearSegment = useCallback((segmentId: number) => {
    mutate(prev => {
      if (!prev.today) return prev;
      const updatedSegments = prev.today.segments.map(s =>
        s.id === segmentId ? { ...s, torn: true, tornAt: Date.now() } : s
      );
      const newIndex = (prev.lastQuoteIndex + 1) % 50;
      return {
        ...prev,
        today: { ...prev.today, segments: updatedSegments },
        lastQuoteIndex: newIndex,
      };
    });
  }, [mutate]);

  const updateTask = useCallback((segmentId: number, task: string) => {
    mutate(prev => {
      if (!prev.today) return prev;
      const updatedSegments = prev.today.segments.map(s =>
        s.id === segmentId ? { ...s, task } : s
      );
      return { ...prev, today: { ...prev.today, segments: updatedSegments } };
    });
  }, [mutate]);

  const undoTearSegment = useCallback((segmentId: number) => {
    mutate(prev => {
      if (!prev.today) return prev;
      const updatedSegments = prev.today.segments.map(s =>
        s.id === segmentId ? { ...s, torn: false, tornAt: null } : s
      );
      return { ...prev, today: { ...prev.today, segments: updatedSegments } };
    });
  }, [mutate]);

  const addHours = useCallback((hoursToAdd: number) => {
    mutate(prev => {
      if (!prev.today || hoursToAdd <= 0) return prev;
      const nextId = prev.today.segments.length + 1;
      const newSegments: Segment[] = Array.from({ length: hoursToAdd }, (_, i) => ({
        id: nextId + i,
        task: '',
        torn: false,
        tornAt: null,
      }));
      return {
        ...prev,
        today: {
          ...prev.today,
          totalHours: prev.today.totalHours + hoursToAdd,
          segments: [...prev.today.segments, ...newSegments],
        },
      };
    });
  }, [mutate]);

  const resetToday = useCallback(() => {
    mutate(prev => {
      const today = getTodayDate();
      if (prev.today) {
        const newHistory = [prev.today, ...prev.history].slice(0, 60);
        const streak = calculateStreak(newHistory, today);
        return { ...prev, today: null, history: newHistory, streak };
      }
      return { ...prev, today: null };
    });
  }, [mutate]);

  const getWeeklyTotal = useCallback(() => {
    const todayTorn = data.today?.segments.filter(s => s.torn).length ?? 0;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    const historyTotal = data.history
      .filter(d => d.date >= weekAgoStr)
      .reduce((sum, d) => sum + d.segments.filter(s => s.torn).length, 0);
    return todayTorn + historyTotal;
  }, [data]);

  return {
    data,
    setupToday,
    tearSegment,
    updateTask,
    undoTearSegment,
    addHours,
    resetToday,
    getWeeklyTotal,
    isSetupRequired: !data.today,
    todayDate: getTodayDate(),
  };
}
