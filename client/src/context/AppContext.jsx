import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    database: { status: 'checking', connected: false },
  });
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebarMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

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
      });
    }
  }, []);

  useEffect(() => {
    fetchBackendHealth();
    const interval = setInterval(fetchBackendHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchBackendHealth]);

  // Handle window resizing for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        closeSidebarMobile,
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
