import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Brain,
  BarChart3,
  Search,
  MessageSquareReply,
  Upload,
  History,
  Settings,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/sentiment', label: 'Sentiment Intelligence', icon: Brain },
  { path: '/products', label: 'Product Intelligence', icon: BarChart3 },
  { path: '/reviews', label: 'Review Explorer', icon: Search },
  { path: '/ai-reply', label: 'AI Reply Studio', icon: MessageSquareReply },
  { path: '/upload', label: 'Upload Reviews', icon: Upload },
  { path: '/history', label: 'Analysis History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, closeSidebarMobile } = useApp();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebarMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-[#101A2B] border-r border-[#20C5F5]/10 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <NavLink
            to="/"
            onClick={closeSidebarMobile}
            className="flex items-center gap-3 focus:outline-none"
            title="ReviewLens"
          >
            <div className="h-10 w-10 min-w-10 rounded-xl gradient-growth flex items-center justify-center shadow-lg shadow-[#10D6A0]/20">
              <Sparkles className="h-5 w-5 text-[#080D19]" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="font-bold text-lg tracking-tight text-white block leading-tight">
                  Review<span className="text-[#10D6A0]">Lens</span>
                </span>
                <span className="text-[11px] font-medium text-[#9BAAC0] tracking-wide block">
                  AI Review Insights
                </span>
              </motion.div>
            )}
          </NavLink>

          {/* Close button on mobile */}
          <button
            onClick={closeSidebarMobile}
            className="lg:hidden p-1.5 rounded-lg text-[#9BAAC0] hover:text-white hover:bg-white/5"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebarMobile}
                title={!sidebarOpen ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#10D6A0]/10 text-[#10D6A0] border border-[#10D6A0]/25 shadow-sm shadow-[#10D6A0]/10'
                      : 'text-[#9BAAC0] hover:text-[#F4F7FC] hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <Icon className="h-5 w-5 min-w-5" />
                {sidebarOpen && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* AI Upgrade / Status Card (When expanded) */}
        {sidebarOpen && (
          <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-[#9165F5]/10 via-[#101A2B] to-[#20C5F5]/5 border border-[#9165F5]/25">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded-md bg-[#9165F5]/20 text-[#9165F5]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-semibold text-white tracking-wide">
                Gemini AI Engine
              </span>
            </div>
            <p className="text-[11px] text-[#9BAAC0] leading-relaxed mb-2.5">
              Configure your API key in Settings to activate AI sentiment and reply drafting.
            </p>
            <button
              onClick={() => {
                navigate('/settings');
                closeSidebarMobile();
              }}
              className="w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-[#9165F5]/20 hover:bg-[#9165F5]/30 text-[#9165F5] border border-[#9165F5]/30 flex items-center justify-between transition-colors"
            >
              <span>Configure Engine</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* User Profile Footer */}
        <div className="p-3 border-t border-white/5 flex items-center gap-3">
          <div className="h-9 w-9 min-w-9 rounded-xl bg-gradient-to-tr from-[#10D6A0] to-[#20C5F5] flex items-center justify-center text-[#080D19] font-bold text-xs shadow-md">
            RL
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden truncate">
              <div className="text-xs font-medium text-white truncate">ReviewLens Admin</div>
              <div className="text-[10px] text-[#9BAAC0] truncate">Local Workspace</div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
