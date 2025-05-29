import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Check, Calendar as CalendarIcon } from 'lucide-react-native';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { updateTask } = useTasks();
  const { categories } = useCategories();
  
  const category = categories.find(c => c.id === task.categoryId);
  
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
      })
    : null;
  
  const toggleTaskCompletion = async () => {
    try {
      await updateTask({
        ...task,
        completed: !task.completed,
      });
    } catch (err) {
      const message = 'Failed to update task status';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
    }
  };
  
  const handleTaskPress = () => {
    router.push(`/task/${task.id}`);
  };
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#64748B';
    }
  };
  
  const getPriorityText = () => {
    switch (task.priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return '';
    }
  };
  
  const getDueDateColor = () => {
    if (!task.dueDate) return '#64748B';
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dueDate < today) {
      return '#EF4444'; // Overdue
    } else if (dueDate.getTime() === today.getTime()) {
      return '#F97316'; // Due today
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return '#F59E0B'; // Due tomorrow
    }
    
    return '#64748B'; // Future date
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        task.completed && styles.completedContainer,
      ]}
      onPress={handleTaskPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          task.completed && styles.checkedBox,
        ]}
        onPress={toggleTaskCompletion}
      >
        {task.completed && (
          <Check size={16} color="#FFFFFF" />
        )}
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            task.completed && styles.completedTitle,
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        
        {task.description ? (
          <Text
            style={[
              styles.description,
              task.completed && styles.completedDescription,
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}
        
        <View style={styles.metadata}>
          {task.dueDate && (
            <View style={styles.dueDateContainer}>
              <CalendarIcon size={14} color={getDueDateColor()} />
              <Text style={[styles.dueDate, { color: getDueDateColor() }]}>
                {formattedDate}
              </Text>
            </View>
          )}
          
          {task.priority && (
            <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor()}20` }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
                {getPriorityText()}
              </Text>
            </View>
          )}
          
          {category && (
            <View 
              style={[
                styles.categoryBadge, 
                { backgroundColor: `${category.color}20` }
              ]}
            >
              <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
              <Text style={[styles.categoryText, { color: category.color }]}>
                {category.name}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedContainer: {
    opacity: 0.7,
    backgroundColor: '#F1F5F9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  completedDescription: {
    color: '#94A3B8',
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  dueDate: {
    fontSize: 12,
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    marginRight: 8,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
});