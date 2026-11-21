import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('reviewlens_sidebar_open');
    return saved !== null ? saved === 'true' : true;
  });

  // Theme: 'light-red' (default) | 'light-blue' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('reviewlens_theme') || 'light-red';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    database: { status: 'checking', connected: false },
    gemini: { configured: false, model: 'gemini-3.5-flash-lite' },
  });
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('reviewlens_sidebar_open', String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next =
        prev === 'dark' ? 'light-red' : prev === 'light-red' ? 'light-blue' : 'dark';
      localStorage.setItem('reviewlens_theme', next);
      return next;
    });
  };

  // Apply theme to <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchBackendHealth = useCallback(async () => {
    try {
      const response = await api.get('/health');
      setBackendHealth(response.data);
    } catch (err) {
      console.warn('Backend health check error:', err.message);
      setBackendHealth({
        status: 'error',
        message: 'Could not reach backend API',
        database: { status: 'disconnected', connected: false },
        gemini: { configured: false, model: 'gemini-3.5-flash-lite' },
      });
    }
  }, []);

  useEffect(() => {
    fetchBackendHealth();
    const interval = setInterval(fetchBackendHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchBackendHealth]);

  return (
    <AppContext.Provider
      value={{
        mobileMenuOpen,
        setMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        backendHealth,
        refreshHealth: fetchBackendHealth,
        notificationCount,
        setNotificationCount,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
