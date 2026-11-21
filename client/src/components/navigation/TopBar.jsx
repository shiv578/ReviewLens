import React from 'react';
import { NavLink } from 'react-router-dom';
import { PanelLeft, PanelLeftClose, Sun, Moon, Palette } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const THEME_ICONS = {
  dark: Moon,
  'light-red': Sun,
  'light-blue': Palette,
};

const THEME_LABELS = {
  dark: 'Dark',
  'light-red': 'Light Red',
  'light-blue': 'Light Blue',
};

const NEXT_THEME = {
  dark: 'light-red',
  'light-red': 'light-blue',
  'light-blue': 'dark',
};

export default function TopBar() {
  const {
    sidebarOpen,
    toggleSidebar,
    theme,
    toggleTheme,
  } = useApp();

  const ThemeIcon = THEME_ICONS[theme] || Sun;
  const isLight = theme !== 'dark';

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md w-full transition-colors duration-300"
      style={{
        backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.95)',
        borderBottom: `1px solid var(--border)`,
        boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Sidebar Toggle & Minimal Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl transition-colors flex items-center justify-center shadow-sm"
              style={{
                color: 'var(--text-secondary)',
                border: `1px solid var(--border)`,
                backgroundColor: 'transparent',
              }}
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </button>

            <NavLink to="/" className="flex items-center gap-2 focus:outline-none">
              <span className="font-bold text-base md:text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Review<span style={{ color: 'var(--accent)' }}>Lens</span>
              </span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  border: `1px solid var(--border)`,
                }}
              >
                AI
              </span>
            </NavLink>
          </div>

          {/* Right: Only the Theme Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              style={{
                backgroundColor: 'var(--accent-soft)',
                border: `1px solid var(--border)`,
                color: 'var(--accent)',
              }}
              title={`Switch to ${THEME_LABELS[NEXT_THEME[theme]]}`}
              aria-label="Toggle theme"
            >
              <ThemeIcon className="h-4 w-4" />
              <span className="text-[11px] font-semibold">{THEME_LABELS[theme]}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
