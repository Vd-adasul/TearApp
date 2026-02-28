import React, { useMemo } from 'react';

interface TornEdgeProps {
  width?: number;
  height?: number;
  color?: string;
  seed?: number;
  position?: 'bottom' | 'top';
}

export function TornEdge({
  height = 8,
  color = '#EDE6DA',
  seed = 0,
  position = 'bottom',
}: TornEdgeProps) {
  const path = useMemo(() => {
    // Generate a consistent jagged path based on seed
    const points: [number, number][] = [];
    const segments = 24;
    const rand = (n: number) => {
      const x = Math.sin(seed * 9301 + n * 49297) * 0.5 + 0.5;
      return x;
    };

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 100;
      const jitter = rand(i) * height - height / 2;
      points.push([x, Math.max(1, Math.min(height - 1, height / 2 + jitter))]);
    }

    if (position === 'bottom') {
      let d = `M 0 0`;
      for (const [x, y] of points) {
        d += ` L ${x} ${y}`;
      }
      d += ` L 100 0 Z`;
      return d;
    } else {
      let d = `M 0 ${height}`;
      for (const [x, y] of points) {
        d += ` L ${x} ${height - y}`;
      }
      d += ` L 100 ${height} Z`;
      return d;
    }
  }, [seed, height, position]);

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="w-full block"
      style={{ height: `${height}px` }}
      aria-hidden
    >
      <path d={path} fill={color} />
    </svg>
  );
}
