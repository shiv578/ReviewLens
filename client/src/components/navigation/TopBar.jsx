import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Bell,
  ChevronDown,
  X,
  Menu,
  LogOut,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/sentiment', label: 'Sentiment', icon: Brain },
  { path: '/products', label: 'Products', icon: BarChart3 },
  { path: '/reviews', label: 'Reviews', icon: Search },
  { path: '/ai-reply', label: 'AI Reply', icon: MessageSquareReply },
  { path: '/upload', label: 'Upload', icon: Upload },
  { path: '/history', label: 'History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, backendHealth, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close menus on outside click or Escape
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
        closeMobileMenu();
      }
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
  }, [closeMobileMenu]);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigate(`/reviews?q=${encodeURIComponent(searchInput.trim())}`);
      closeMobileMenu();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const isDbConnected = backendHealth?.database?.connected;

  return (
    <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md border-b border-white/[0.08] w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 1. Left: Brand Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 focus:outline-none shrink-0"
            title="ReviewLens Home"
          >
            <div className="h-9 w-9 rounded-xl gradient-growth flex items-center justify-center shadow-md shadow-[#00F0FF]/20">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base md:text-lg tracking-tight text-white">
                Review<span className="text-[#00F0FF]">Lens</span>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white/10 text-[#00F0FF] border border-white/10">
                OLED
              </span>
            </div>
          </NavLink>

          {/* 2. Center: Desktop Horizontal Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/25 shadow-sm'
                        : 'text-[#8E8E98] hover:text-white hover:bg-white/5 border border-transparent'
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* 3. Right: Search & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center relative w-48 xl:w-56"
            >
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E8E98]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search... (⌘K)"
                className="w-full pl-8 pr-12 py-1.5 rounded-lg bg-[#0C0C0F] border border-white/10 text-xs text-white placeholder-[#8E8E98]/50 focus:border-[#00F0FF] focus:outline-none transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-[#8E8E98] hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-white/5 text-[9px] text-[#8E8E98] font-mono">
                ⌘K
              </span>
            </form>

            {/* DB Status Pill */}
            <div
              title={`MongoDB: ${backendHealth?.database?.status || 'Unknown'}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0C0C0F] border border-white/10"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isDbConnected ? 'bg-[#10E599]' : 'bg-[#FBBF24]'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isDbConnected ? 'bg-[#10E599]' : 'bg-[#FBBF24]'
                  }`}
                />
              </span>
              <span className="text-[#8E8E98]">
                {isDbConnected ? 'DB Active' : 'DB Offline'}
              </span>
            </div>

            {/* Gemini AI Status Pill */}
            <div
              title={`Google Gemini Engine: ${backendHealth?.gemini?.configured ? 'Active (' + (backendHealth?.gemini?.model || 'gemini-3.8-flash') + ')' : 'Offline'}`}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0C0C0F] border border-white/10"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    backendHealth?.gemini?.configured ? 'bg-[#00F0FF]' : 'bg-[#FBBF24]'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    backendHealth?.gemini?.configured ? 'bg-[#00F0FF]' : 'bg-[#FBBF24]'
                  }`}
                />
              </span>
              <span className="text-[#8E8E98]">
                {backendHealth?.gemini?.configured ? 'AI Active' : 'AI Offline'}
              </span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="p-2 rounded-lg text-[#8E8E98] hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
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
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0C0C0F] border border-white/10 shadow-2xl p-4 z-50 text-left"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-semibold text-white">System Notifications</span>
                      <span className="text-[10px] text-[#8E8E98]">Live Alerts</span>
                    </div>
                    <div className="py-4 text-center">
                      <p className="text-xs text-[#8E8E98]">No unread alerts.</p>
                      <p className="text-[10px] text-[#8E8E98]/60 mt-1">
                        Upload reviews to view batch processing notifications.
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
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="User menu"
              >
                <div className="h-7 w-7 rounded-lg gradient-growth flex items-center justify-center text-black font-bold text-xs shadow-sm">
                  RL
                </div>
                <ChevronDown className="h-3 w-3 text-[#8E8E98]" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0C0C0F] border border-white/10 shadow-2xl p-2 z-50 text-left"
                  >
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-xs font-semibold text-white truncate">ReviewLens Admin</p>
                      <p className="text-[10px] text-[#8E8E98] truncate">admin@reviewlens.local</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#8E8E98] hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/upload');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#8E8E98] hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload Dataset</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-white/5">
                      <div className="px-3 py-1 flex items-center justify-between text-[11px] text-[#8E8E98]">
                        <span className="flex items-center gap-1.5">
                          <LogOut className="h-3 w-3" /> Log Out
                        </span>
                        <span className="text-[9px] px-1 rounded bg-white/5">Local</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="xl:hidden p-2 rounded-lg text-[#8E8E98] hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile / Responsive Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-white/10 bg-[#0C0C0F] px-4 py-3 space-y-2"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full pb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E8E98]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#000000] border border-white/10 text-xs text-white placeholder-[#8E8E98]/50 focus:border-[#00F0FF] focus:outline-none"
              />
            </form>

            {/* Mobile Nav Links Grid */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/25'
                          : 'text-[#8E8E98] hover:text-white hover:bg-white/5 border border-transparent'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
