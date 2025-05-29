import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '@/types/settings';

const SETTINGS_STORAGE_KEY = 'taskmaster:settings';

const DEFAULT_SETTINGS: Settings = {
  showCompletedTasks: true,
  dueDateReminders: true,
  sortByDueDate: true,
  darkMode: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load settings on initial mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError(err instanceof Error ? err : new Error('Failed to load settings'));
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError(err instanceof Error ? err : new Error('Failed to save settings'));
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    saveSettings(newSettings);
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY);
      setSettings(DEFAULT_SETTINGS);
    } catch (err) {
      console.error('Failed to reset settings:', err);
      setError(err instanceof Error ? err : new Error('Failed to reset settings'));
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
  };
}