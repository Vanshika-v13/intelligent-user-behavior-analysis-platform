import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col">
      <Navbar 
        breadcrumb={<span className="font-semibold text-lg text-[var(--color-primary)]">Intelligent User Behavior Analytics</span>}
        onMenuClick={() => {}}
      />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
