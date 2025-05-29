import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { Task } from '@/types/task';

export default function NewTaskScreen() {
  const { addTask } = useTasks();
  const { categories } = useCategories();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSaveTask = async () => {
    try {
      if (title.trim() === '') {
        setError('Title is required');
        return;
      }
      
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority,
        categoryId: categoryId || undefined,
      };
      
      if (dueDate) {
        newTask.dueDate = dueDate.toISOString();
      }
      
      await addTask(newTask);
      router.back();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dueDate;
    if (Platform.OS === 'web') {
      setShowDatePicker(false);
    } else {
      setShowDatePicker(Platform.OS === 'ios');
    }
    
    if (currentDate) {
      setDueDate(currentDate);
    }
  };
  
  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Task</Text>
        <TouchableOpacity
          style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
          onPress={handleSaveTask}
          disabled={!title.trim()}
        >
          <Text
            style={[styles.saveButtonText, !title.trim() && styles.saveButtonTextDisabled]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title*</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setError(null);
            }}
            placeholder="Task title"
            autoFocus
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about this task"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              style={{
                ...styles.input,
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: '#334155',
                backgroundColor: '#F8FAFC',
                width: '100%',
              }}
              onChange={(e) => {
                if (e.target.value) {
                  setDueDate(new Date(e.target.value));
                } else {
                  setDueDate(null);
                }
              }}
              value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={showDatepicker}
              >
                <CalendarIcon size={20} color="#64748B" />
                <Text style={styles.datePickerText}>
                  {dueDate ? dueDate.toDateString() : 'Select a date'}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityButtons}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                styles.lowPriority,
                priority === 'low' && styles.activePriorityButton,
              ]}
              onPress={() => setPriority('low')}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'low' && styles.activePriorityButtonText,
                ]}
              >
                Low
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.priorityButton,
                styles.mediumPriority,
                priority === 'medium' && styles.activePriorityButton,
              ]}
              onPress={() => setPriority('medium')}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'medium' && styles.activePriorityButtonText,
                ]}
              >
                Medium
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.priorityButton,
                styles.highPriority,
                priority === 'high' && styles.activePriorityButton,
              ]}
              onPress={() => setPriority('high')}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'high' && styles.activePriorityButtonText,
                ]}
              >
                High
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: categoryId === category.id
                      ? category.color
                      : `${category.color}20`,
                  },
                ]}
                onPress={() => setCategoryId(
                  categoryId === category.id ? null : category.id
                )}
              >
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: category.color },
                  ]}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: categoryId === category.id
                        ? '#FFFFFF'
                        : category.color,
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
            {categories.length === 0 && (
              <Text style={styles.noCategoriesText}>
                No categories available
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  saveButtonTextDisabled: {
    color: '#94A3B8',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#334155',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    minHeight: 100,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  datePickerText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 8,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  lowPriority: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  mediumPriority: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  highPriority: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  activePriorityButton: {
    borderWidth: 0,
  },
  activePriorityButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginRight: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noCategoriesText: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});