import { useState, useEffect, useCallback } from 'react';
import { fetchNotices } from '../services/api';

export function useNotices() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNotices();
      setNotices(data);
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  return { notices, isLoading, error, reload: loadNotices };
}