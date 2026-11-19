import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useRecentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/reviews/recent');
      setReviews(response.data?.data || []);
      setError(null);
    } catch (err) {
      console.warn('Failed to load recent reviews:', err.message);
      setError(err.response?.data?.message || err.message || 'Unable to connect to reviews service');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentReviews();
  }, [fetchRecentReviews]);

  return { reviews, loading, error, refetch: fetchRecentReviews };
};

export default useRecentReviews;
