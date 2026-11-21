import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/navigation/TopBar';
import Sidebar from '../components/navigation/Sidebar';

export default function MainLayout() {
  return (
    <div
      className="min-h-screen flex flex-col w-full transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <TopBar />
      <div className="flex-1 flex w-full">
        <Sidebar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full min-w-0 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
