import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { ChevronRight, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useSettings } from '@/hooks/useSettings';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const { clearAllTasks } = useTasks();
  const { clearAllCategories } = useCategories();
  
  const handleToggleSetting = (key: string, value: boolean) => {
    updateSettings({ [key]: value });
  };
  
  const confirmClearData = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      );
      if (confirm) {
        clearAllTasks();
        clearAllCategories();
      }
    } else {
      Alert.alert(
        'Clear All Data',
        'Are you sure you want to clear all data? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear Data', 
            style: 'destructive',
            onPress: () => {
              clearAllTasks();
              clearAllCategories();
            }
          }
        ]
      );
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Show Completed Tasks</Text>
            <Text style={styles.settingDescription}>
              Display completed tasks in the task list
            </Text>
          </View>
          <Switch
            value={settings?.showCompletedTasks ?? true}
            onValueChange={(value) => 
              handleToggleSetting('showCompletedTasks', value)
            }
            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
            thumbColor={settings?.showCompletedTasks ? '#3B82F6' : '#F3F4F6'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Due Date Reminders</Text>
            <Text style={styles.settingDescription}>
              Receive notifications for upcoming task due dates
            </Text>
          </View>
          <Switch
            value={settings?.dueDateReminders ?? true}
            onValueChange={(value) => 
              handleToggleSetting('dueDateReminders', value)
            }
            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
            thumbColor={settings?.dueDateReminders ? '#3B82F6' : '#F3F4F6'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Sort By Due Date</Text>
            <Text style={styles.settingDescription}>
              Automatically sort tasks by their due dates
            </Text>
          </View>
          <Switch
            value={settings?.sortByDueDate ?? true}
            onValueChange={(value) => 
              handleToggleSetting('sortByDueDate', value)
            }
            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
            thumbColor={settings?.sortByDueDate ? '#3B82F6' : '#F3F4F6'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use dark theme throughout the app
            </Text>
          </View>
          <Switch
            value={settings?.darkMode ?? false}
            onValueChange={(value) => 
              handleToggleSetting('darkMode', value)
            }
            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
            thumbColor={settings?.darkMode ? '#3B82F6' : '#F3F4F6'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <TouchableOpacity style={styles.dangerButton} onPress={confirmClearData}>
          <AlertTriangle size={20} color="#FFFFFF" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
        
        <Text style={styles.dangerDescription}>
          This will permanently delete all tasks and categories. This action cannot be undone.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Developer</Text>
          <Text style={styles.aboutValue}>TaskMaster Team</Text>
        </View>
        
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Privacy Policy</Text>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Terms of Service</Text>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  aboutLabel: {
    fontSize: 16,
    color: '#334155',
  },
  aboutValue: {
    fontSize: 16,
    color: '#64748B',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  linkText: {
    fontSize: 16,
    color: '#3B82F6',
  },
});