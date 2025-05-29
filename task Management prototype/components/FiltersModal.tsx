import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useFilters } from '@/hooks/useFilters';
import { useCategories } from '@/hooks/useCategories';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
}

export function FiltersModal({ visible, onClose }: FiltersModalProps) {
  const { filters, updateFilters } = useFilters();
  const { categories } = useCategories();
  
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleApplyFilters = () => {
    updateFilters(localFilters);
    onClose();
  };
  
  const handleReset = () => {
    const resetFilters = {
      showCompleted: true,
      priorities: ['low', 'medium', 'high'],
      categories: [],
      sortBy: 'dueDate',
      sortDirection: 'asc',
    };
    setLocalFilters(resetFilters);
    updateFilters(resetFilters);
    onClose();
  };
  
  const togglePriority = (priority: string) => {
    setLocalFilters(prev => {
      const newPriorities = [...prev.priorities];
      const index = newPriorities.indexOf(priority);
      if (index > -1) {
        newPriorities.splice(index, 1);
      } else {
        newPriorities.push(priority);
      }
      return { ...prev, priorities: newPriorities };
    });
  };
  
  const toggleCategory = (categoryId: string) => {
    setLocalFilters(prev => {
      const newCategories = [...prev.categories];
      const index = newCategories.indexOf(categoryId);
      if (index > -1) {
        newCategories.splice(index, 1);
      } else {
        newCategories.push(categoryId);
      }
      return { ...prev, categories: newCategories };
    });
  };
  
  const setSortBy = (sortBy: string) => {
    setLocalFilters(prev => ({ ...prev, sortBy }));
  };
  
  const toggleSortDirection = () => {
    setLocalFilters(prev => ({
      ...prev,
      sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Task Status</Text>
              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => setLocalFilters(prev => ({
                  ...prev,
                  showCompleted: !prev.showCompleted,
                }))}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>Show Completed Tasks</Text>
                </View>
                <View
                  style={[
                    styles.toggleSwitch,
                    localFilters.showCompleted && styles.toggleSwitchActive,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleHandle,
                      localFilters.showCompleted && styles.toggleHandleActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Priority</Text>
              <View>
                {['high', 'medium', 'low'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={styles.filterOption}
                    onPress={() => togglePriority(priority)}
                  >
                    <View style={styles.optionContent}>
                      <View
                        style={[
                          styles.priorityDot,
                          priority === 'high' && styles.highPriorityDot,
                          priority === 'medium' && styles.mediumPriorityDot,
                          priority === 'low' && styles.lowPriorityDot,
                        ]}
                      />
                      <Text style={styles.optionText}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        localFilters.priorities.includes(priority) && styles.checkboxActive,
                      ]}
                    >
                      {localFilters.priorities.includes(priority) && (
                        <Check size={14} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {categories.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.filterOption}
                      onPress={() => toggleCategory(category.id)}
                    >
                      <View style={styles.optionContent}>
                        <View
                          style={[
                            styles.categoryDot,
                            { backgroundColor: category.color },
                          ]}
                        />
                        <Text style={styles.optionText}>{category.name}</Text>
                      </View>
                      <View
                        style={[
                          styles.checkbox,
                          localFilters.categories.includes(category.id) && styles.checkboxActive,
                        ]}
                      >
                        {localFilters.categories.includes(category.id) && (
                          <Check size={14} color="#FFFFFF" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View>
                {[
                  { id: 'dueDate', label: 'Due Date' },
                  { id: 'priority', label: 'Priority' },
                  { id: 'title', label: 'Title' },
                  { id: 'createdAt', label: 'Date Created' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.filterOption}
                    onPress={() => setSortBy(option.id)}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                    <View
                      style={[
                        styles.radioButton,
                        localFilters.sortBy === option.id && styles.radioButtonActive,
                      ]}
                    >
                      {localFilters.sortBy === option.id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity
                style={[styles.filterOption, styles.directionOption]}
                onPress={toggleSortDirection}
              >
                <Text style={styles.optionText}>Sort Direction</Text>
                <Text style={styles.directionText}>
                  {localFilters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  closeButton: {
    padding: 4,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterSection: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#334155',
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CBD5E1',
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#3B82F6',
  },
  toggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleHandleActive: {
    transform: [{ translateX: 20 }],
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  highPriorityDot: {
    backgroundColor: '#EF4444',
  },
  mediumPriorityDot: {
    backgroundColor: '#F59E0B',
  },
  lowPriorityDot: {
    backgroundColor: '#10B981',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: '#3B82F6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  directionOption: {
    marginTop: 8,
  },
  directionText: {
    fontSize: 14,
    color: '#64748B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});