import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { ApiResponse } from '@monorepo/types';

export function useData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      const response: ApiResponse<T> = await apiClient.get(endpoint);

      if (response.error) {
        setError(response.error.message);
      } else {
        setData(response.data);
      }

      setLoading(false);
    }

    fetchData();
  }, [endpoint]);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    const response: ApiResponse<T> = await apiClient.get(endpoint);

    if (response.error) {
      setError(response.error.message);
    } else {
      setData(response.data);
    }

    setLoading(false);
  };

  return { data, loading, error, refetch };
}
