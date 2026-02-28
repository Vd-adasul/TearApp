import React from 'react';
import { Outlet } from 'react-router';

export function Root() {
  return (
    <div
      className="min-h-screen"
      style={{ background: '#F5F0E8', fontFamily: 'Inter, sans-serif' }}
    >
      <Outlet />
    </div>
  );
}
