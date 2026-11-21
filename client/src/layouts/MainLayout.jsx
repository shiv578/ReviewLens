import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/navigation/TopBar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#F4F4F6] flex flex-col w-full">
      <TopBar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full">
        <Outlet />
      </main>
    </div>
  );
}
