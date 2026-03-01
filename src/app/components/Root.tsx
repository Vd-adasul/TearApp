import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { SplashScreen } from './SplashScreen';

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const gestureRef = useRef({
    active: false,
    triggered: false,
    startX: 0,
    startY: 0,
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const EDGE_WIDTH = 28;
    const HORIZONTAL_THRESHOLD = 72;
    const HORIZONTAL_RATIO = 1.25;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      gestureRef.current.active = t.clientX <= EDGE_WIDTH && location.pathname !== '/';
      gestureRef.current.triggered = false;
      gestureRef.current.startX = t.clientX;
      gestureRef.current.startY = t.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!gestureRef.current.active || gestureRef.current.triggered) return;
      const t = e.touches[0];
      if (!t) return;

      const dx = t.clientX - gestureRef.current.startX;
      const dy = Math.abs(t.clientY - gestureRef.current.startY);
      if (dx <= 0) return;
      if (Math.abs(dx) < dy * HORIZONTAL_RATIO) return;

      if (dx >= HORIZONTAL_THRESHOLD) {
        gestureRef.current.triggered = true;
        gestureRef.current.active = false;
        navigate(-1);
      }
    };

    const onTouchEnd = () => {
      gestureRef.current.active = false;
      gestureRef.current.triggered = false;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [navigate, location.pathname]);

  return (
    <div
      className="min-h-screen transition-colors duration-500 ease-in-out"
      style={{
        background: isDarkMode ? '#1C1917' : '#F5F0E8',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className={showSplash ? 'hidden' : 'block'}>
        <Outlet context={{ isDarkMode, setIsDarkMode }} />
      </div>
    </div>
  );
}
