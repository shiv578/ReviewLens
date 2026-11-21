import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Brain,
  Search,
  MessageSquareReply,
  Upload,
  History,
  Settings,
  PanelLeftClose,
  Sparkles,
  ChevronLeft,
  Database,
  Cpu,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: '/overview', label: 'Overview', icon: LayoutDashboard, badge: 'Live' },
  { path: '/', label: 'Dashboard', icon: Upload, badge: 'Upload' },
  { path: '/sentiment', label: 'Sentiment', icon: Brain },
  { path: '/reviews', label: 'Reviews', icon: Search },
  { path: '/products', label: 'Products', icon: BarChart3 },
  { path: '/ai-reply', label: 'AI Reply', icon: MessageSquareReply, badge: 'AI' },
  { path: '/history', label: 'History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, backendHealth, theme } = useApp();
  const location = useLocation();
  const isGeminiReady = backendHealth?.gemini?.configured;
  const isDbConnected = backendHealth?.database?.connected;
  const isLight = theme !== 'dark';

  const isItemActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/upload';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <AnimatePresence initial={false}>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="h-[calc(100vh-4rem)] sticky top-16 flex flex-col shrink-0 overflow-hidden z-30 select-none"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRight: `1px solid var(--border)`,
            boxShadow: isLight ? '1px 0 4px rgba(0,0,0,0.06)' : '1px 0 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Logo / Brand */}
          <div
            className="p-4 flex items-center justify-between"
            style={{ borderBottom: `1px solid var(--border)` }}
          >
            <NavLink to="/" className="flex items-center gap-2.5 focus:outline-none group">
              <div
                className="h-9 w-9 rounded-xl gradient-growth flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
              >
                <TrendingUp className="h-5 w-5" style={{ color: 'var(--btn-text)' }} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                  ReviewLens
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                  AI Review Insights
                </p>
              </div>
            </NavLink>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              title="Hide sidebar"
              aria-label="Hide sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    active
                      ? 'font-semibold shadow-sm'
                      : 'hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] font-normal'
                  }`}
                  style={{
                    backgroundColor: active ? 'var(--accent)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <div
                    className="flex items-center gap-2.5 truncate"
                    style={{ color: active ? '#FFFFFF' : 'inherit' }}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: active ? '#FFFFFF' : 'inherit' }} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                      style={
                        active
                          ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF' }
                          : item.badge === 'AI'
                          ? { backgroundColor: 'rgba(145,101,245,0.15)', color: '#9165F5', border: '1px solid rgba(145,101,245,0.3)' }
                          : { backgroundColor: 'var(--accent-soft)', color: 'var(--accent)', border: `1px solid var(--border)` }
                      }
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Promo Card */}
          <div className="p-3">
            <div
              className="rounded-xl p-3 gradient-growth overflow-hidden relative"
              style={{ minHeight: 90 }}
            >
              <div
                className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-20"
                style={{ backgroundColor: 'var(--btn-text)' }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--btn-text)' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--btn-text)' }}>
                    AI-Powered
                  </span>
                </div>
                <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--btn-text)' }}>
                  Review Analysis
                </p>
                <p className="text-[10px] mt-1 opacity-80" style={{ color: 'var(--btn-text)' }}>
                  Turn customer feedback into actionable insights
                </p>
              </div>
            </div>
          </div>

          {/* System Status Footer */}
          <div
            className="p-3.5 space-y-2"
            style={{ borderTop: `1px solid var(--border)` }}
          >
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5">
                  <Cpu className="h-3 w-3" style={{ color: 'var(--accent)' }} />
                  <span>Gemini Engine</span>
                </span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={
                    isGeminiReady
                      ? { backgroundColor: 'rgba(56,161,105,0.12)', color: '#38A169' }
                      : { backgroundColor: 'rgba(214,158,46,0.12)', color: '#D69E2E' }
                  }
                >
                  {isGeminiReady ? 'Active' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5">
                  <Database className="h-3 w-3" style={{ color: '#38A169' }} />
                  <span>MongoDB</span>
                </span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={
                    isDbConnected
                      ? { backgroundColor: 'rgba(56,161,105,0.12)', color: '#38A169' }
                      : { backgroundColor: 'rgba(214,158,46,0.12)', color: '#D69E2E' }
                  }
                >
                  {isDbConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>

            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                border: `1px solid var(--border)`,
              }}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Hide Sidebar</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
