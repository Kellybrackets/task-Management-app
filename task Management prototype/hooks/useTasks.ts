import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';

const TASKS_STORAGE_KEY = 'taskmaster:tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err instanceof Error ? err : new Error('Failed to load tasks'));
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      const tasksString = JSON.stringify(newTasks);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, tasksString);
      setTasks(newTasks);
      setError(null);
    } catch (err) {
      console.error('Failed to save tasks:', err);
      throw err instanceof Error ? err : new Error('Failed to save tasks');
    }
  };

  const addTask = async (task: Task) => {
    try {
      const newTasks = [...tasks, task];
      await saveTasks(newTasks);
    } catch (err) {
      console.error('Failed to add task:', err);
      throw err instanceof Error ? err : new Error('Failed to add task');
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const newTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      await saveTasks(newTasks);
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err instanceof Error ? err : new Error('Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const newTasks = tasks.filter(task => task.id !== taskId);
      await saveTasks(newTasks);
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err instanceof Error ? err : new Error('Failed to delete task');
    }
  };

  const clearAllTasks = async () => {
    try {
      await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
      setTasks([]);
      setError(null);
    } catch (err) {
      console.error('Failed to clear tasks:', err);
      throw err instanceof Error ? err : new Error('Failed to clear tasks');
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    clearAllTasks,
    refreshTasks: loadTasks,
  };
}