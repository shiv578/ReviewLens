import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  X,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Activity,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const routeTitles = {
  '/': 'Dashboard Overview',
  '/sentiment': 'Sentiment Intelligence',
  '/products': 'Product Intelligence',
  '/reviews': 'Review Explorer',
  '/ai-reply': 'AI Reply Studio',
  '/upload': 'Upload Reviews',
  '/history': 'Analysis History',
  '/settings': 'Workspace Settings',
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar, searchQuery, setSearchQuery, backendHealth } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentTitle = routeTitles[location.pathname] || 'ReviewLens Intelligence';

  // Handle outside click & escape to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
      // Shortcut Ctrl+K or Cmd+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigate(`/reviews?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const isDbConnected = backendHealth?.database?.connected;

  return (
    <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 bg-[#080D19]/90 backdrop-blur-md border-b border-[#20C5F5]/10">
      {/* Left: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-[#9BAAC0] hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-base md:text-lg font-semibold text-white tracking-tight truncate">
          {currentTitle}
        </h1>
      </div>

      {/* Center: Global Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden sm:flex items-center relative max-w-xs md:max-w-md w-full mx-4"
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9BAAC0]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search reviews, products... (⌘K)"
            className="w-full pl-9 pr-14 py-1.5 rounded-xl bg-[#101A2B] border border-white/10 text-xs md:text-sm text-white placeholder-[#9BAAC0]/60 focus:border-[#10D6A0] focus:ring-1 focus:ring-[#10D6A0] focus:outline-none transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-[#9BAAC0] hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-[#9BAAC0] font-mono select-none">
            ⌘K
          </span>
        </div>
      </form>

      {/* Right: Status Pill & Dropdowns */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Backend & DB Status Pill */}
        <div
          title={`Backend: ${backendHealth?.status || 'Unknown'} | MongoDB: ${
            backendHealth?.database?.status || 'Unknown'
          }`}
          className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-[#101A2B] border border-white/10"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isDbConnected ? 'bg-[#10D6A0]' : 'bg-[#F5B942]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isDbConnected ? 'bg-[#10D6A0]' : 'bg-[#F5B942]'
              }`}
            />
          </span>
          <span className="text-[#9BAAC0] text-[11px]">
            {isDbConnected ? 'DB Connected' : 'DB Offline'}
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="p-2 rounded-xl text-[#9BAAC0] hover:text-white hover:bg-white/5 border border-white/5 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#101A2B] border border-white/10 shadow-xl shadow-black/50 p-4 z-50 text-left"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-xs font-semibold text-white">System Notifications</span>
                  <span className="text-[10px] text-[#9BAAC0]">Live Alerts</span>
                </div>
                <div className="py-6 text-center">
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-[#9BAAC0]">
                    <Bell className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-[#9BAAC0]">No unread notifications.</p>
                  <p className="text-[10px] text-[#9BAAC0]/60 mt-1">
                    Upload reviews to receive analysis completion alerts.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors"
            aria-label="User profile menu"
          >
            <div className="h-7 w-7 rounded-lg gradient-growth flex items-center justify-center text-[#080D19] font-bold text-xs shadow-sm">
              RL
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#9BAAC0]" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#101A2B] border border-white/10 shadow-xl shadow-black/50 p-2 z-50 text-left"
              >
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-xs font-semibold text-white truncate">ReviewLens Admin</p>
                  <p className="text-[10px] text-[#9BAAC0] truncate">admin@reviewlens.local</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#9BAAC0] hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Workspace Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/upload');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#9BAAC0] hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <User className="h-4 w-4" />
                    <span>Data Ingestion</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-white/5">
                  <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-[#9BAAC0]">
                    <span className="flex items-center gap-2">
                      <LogOut className="h-3.5 w-3.5" /> Log Out
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[#9BAAC0]">
                      Local Only
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
