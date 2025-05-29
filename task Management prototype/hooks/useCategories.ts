import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '@/types/category';

const CATEGORIES_STORAGE_KEY = 'taskmaster:categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load categories on initial mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const storedCategories = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // Default categories
        const defaultCategories: Category[] = [
          { id: '1', name: 'Work', color: '#3B82F6' },
          { id: '2', name: 'Personal', color: '#F97316' },
          { id: '3', name: 'Shopping', color: '#10B981' },
        ];
        setCategories(defaultCategories);
        await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err instanceof Error ? err : new Error('Failed to load categories'));
    } finally {
      setLoading(false);
    }
  };

  const saveCategories = async (newCategories: Category[]) => {
    try {
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newCategories));
    } catch (err) {
      console.error('Failed to save categories:', err);
      setError(err instanceof Error ? err : new Error('Failed to save categories'));
    }
  };

  const addCategory = async (category: Category) => {
    const newCategories = [...categories, category];
    setCategories(newCategories);
    await saveCategories(newCategories);
  };

  const updateCategory = async (updatedCategory: Category) => {
    const newCategories = categories.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    );
    setCategories(newCategories);
    await saveCategories(newCategories);
  };

  const deleteCategory = async (categoryId: string) => {
    const newCategories = categories.filter(category => category.id !== categoryId);
    setCategories(newCategories);
    await saveCategories(newCategories);
  };

  const clearAllCategories = async () => {
    setCategories([]);
    await AsyncStorage.removeItem(CATEGORIES_STORAGE_KEY);
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    clearAllCategories,
    refreshCategories: loadCategories,
  };
}