import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { Plus, Search, X, Filter } from 'lucide-react-native';
import { router } from 'expo-router';

import { Task } from '@/types/task';
import { TaskItem } from '@/components/TaskItem';
import { useTasks } from '@/hooks/useTasks';
import { FiltersModal } from '@/components/FiltersModal';

export default function TasksScreen() {
  const { tasks, loading, error } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  const searchAnim = new Animated.Value(0);
  
  useEffect(() => {
    if (tasks) {
      let result = [...tasks];
      
      // Apply search filter
      if (searchQuery) {
        result = result.filter(task => 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Sort by due date (closest first)
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
      
      setFilteredTasks(result);
    }
  }, [tasks, searchQuery]);
  
  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: showSearch ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showSearch]);
  
  const searchWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '85%'],
  });
  
  const handleAddTask = () => {
    router.push('/task/new');
  };
  
  const toggleSearch = () => {
    if (showSearch) {
      setSearchQuery('');
    }
    setShowSearch(!showSearch);
  };
  
  const renderHeader = () => {
    const incomplete = tasks ? tasks.filter(task => !task.completed).length : 0;
    const total = tasks ? tasks.length : 0;
    
    return (
      <View style={styles.headerContainer}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>Tasks Remaining</Text>
          <Text style={styles.statsValue}>{incomplete} of {total}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${total > 0 ? ((total - incomplete) / total) * 100 : 0}%` }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load tasks</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Animated.View style={[styles.searchInputContainer, { width: searchWidth }]}>
          {showSearch && (
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={Platform.OS !== 'web'}
            />
          )}
        </Animated.View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.iconButton}>
            <Filter size={22} color="#64748B" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
            {showSearch ? (
              <X size={22} color="#64748B" />
            ) : (
              <Search size={22} color="#64748B" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem task={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Add a task to get started'}
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <FiltersModal visible={showFilters} onClose={() => setShowFilters(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  searchInputContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  searchInput: {
    fontSize: 16,
    color: '#334155',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#3B82F6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
  },
  headerContainer: {
    marginVertical: 16,
  },
  statsContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
});