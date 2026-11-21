import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    database: { status: 'checking', connected: false },
  });
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

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

  return (
    <AppContext.Provider
      value={{
        mobileMenuOpen,
        setMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
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
