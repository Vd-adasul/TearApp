import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { SplashScreen } from './SplashScreen';

export function Root() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
