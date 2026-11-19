import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/stats');
      setStats(response.data?.data || null);
      setError(null);
    } catch (err) {
      console.warn('Failed to load stats:', err.message);
      setError(err.response?.data?.message || err.message || 'Unable to connect to stats service');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Poll every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export default useStats;
