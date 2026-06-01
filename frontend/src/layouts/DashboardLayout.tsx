import { Outlet } from 'react-router-dom';

import { useState } from 'react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {

  const [collapsed, setCollapsed] =
    useState(false);

  return (

    <div className="bg-slate-100 min-h-screen">

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50
          transition-all duration-500
          
          ${
            collapsed
              ? 'w-24'
              : 'w-72'
          }
        `}
      >

        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

      </div>

      {/* Main Content */}
      <div
        className={`
          min-h-screen flex flex-col
          transition-all duration-500
          
          ${
            collapsed
              ? 'ml-24'
              : 'ml-72'
          }
        `}
      >

        {/* Navbar */}
        <div className="sticky top-0 z-40">

          <Navbar />

        </div>

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-y-auto">

          <Outlet />

        </main>

      </div>

    </div>
  );
}