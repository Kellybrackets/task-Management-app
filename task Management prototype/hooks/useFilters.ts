import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Filters } from '@/types/filters';

const FILTERS_STORAGE_KEY = 'taskmaster:filters';

const DEFAULT_FILTERS: Filters = {
  showCompleted: true,
  priorities: ['low', 'medium', 'high'],
  categories: [],
  sortBy: 'dueDate',
  sortDirection: 'asc',
};

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load filters on initial mount
  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      setLoading(true);
      const storedFilters = await AsyncStorage.getItem(FILTERS_STORAGE_KEY);
      if (storedFilters) {
        setFilters({ ...DEFAULT_FILTERS, ...JSON.parse(storedFilters) });
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load filters:', err);
      setError(err instanceof Error ? err : new Error('Failed to load filters'));
    } finally {
      setLoading(false);
    }
  };

  const saveFilters = async (newFilters: Filters) => {
    try {
      await AsyncStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(newFilters));
    } catch (err) {
      console.error('Failed to save filters:', err);
      setError(err instanceof Error ? err : new Error('Failed to save filters'));
    }
  };

  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    saveFilters(newFilters);
  };

  const resetFilters = async () => {
    setFilters(DEFAULT_FILTERS);
    await AsyncStorage.removeItem(FILTERS_STORAGE_KEY);
  };

  return {
    filters,
    loading,
    error,
    updateFilters,
    resetFilters,
  };
}