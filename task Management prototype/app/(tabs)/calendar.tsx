import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from '@/components/TaskItem';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarScreen() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get days to display from previous month
    const daysFromPrevMonth = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const calendarDays = [];
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      calendarDays.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      calendarDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Add days from next month
    const remainingDays = 42 - calendarDays.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return calendarDays;
  };
  
  const calendarDays = getCalendarDays();
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  const hasTasks = (date) => {
    if (!tasks) return false;
    return tasks.some(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };
  
  const tasksForSelectedDate = tasks ? tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate.getDate() === selectedDate.getDate() &&
           taskDate.getMonth() === selectedDate.getMonth() &&
           taskDate.getFullYear() === selectedDate.getFullYear();
  }) : [];
  
  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <ChevronLeft size={24} color="#64748B" />
        </TouchableOpacity>
        
        <Text style={styles.monthYearText}>
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <ChevronRight size={24} color="#64748B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.daysOfWeek}>
        {DAYS.map((day, index) => (
          <Text key={index} style={styles.dayOfWeekText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayContainer,
              !day.isCurrentMonth && styles.notCurrentMonth,
              isSelected(day.date) && styles.selectedDay,
              isToday(day.date) && styles.today
            ]}
            onPress={() => setSelectedDate(day.date)}
          >
            <Text style={[
              styles.dayText,
              !day.isCurrentMonth && styles.notCurrentMonthText,
              isSelected(day.date) && styles.selectedDayText,
              isToday(day.date) && styles.todayText
            ]}>
              {day.date.getDate()}
            </Text>
            {hasTasks(day.date) && (
              <View style={[
                styles.taskIndicator,
                isSelected(day.date) && styles.selectedTaskIndicator
              ]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.selectedDateContainer}>
        <View style={styles.selectedDateHeader}>
          <CalendarIcon size={20} color="#3B82F6" />
          <Text style={styles.selectedDateText}>
            {selectedDate.toDateString()}
          </Text>
        </View>
        
        <ScrollView style={styles.taskListContainer}>
          {tasksForSelectedDate.length > 0 ? (
            tasksForSelectedDate.map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <View style={styles.noTasksContainer}>
              <Text style={styles.noTasksText}>No tasks for this date</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  navButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  daysOfWeek: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dayContainer: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  dayText: {
    fontSize: 16,
    color: '#334155',
  },
  notCurrentMonth: {
    opacity: 0.4,
  },
  notCurrentMonthText: {
    color: '#94A3B8',
  },
  selectedDay: {
    backgroundColor: '#3B82F6',
    borderRadius: 100,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  today: {
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 100,
  },
  todayText: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  taskIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
    marginTop: 2,
  },
  selectedTaskIndicator: {
    backgroundColor: '#FFFFFF',
  },
  selectedDateContainer: {
    flex: 1,
    padding: 16,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 8,
  },
  taskListContainer: {
    flex: 1,
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noTasksText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
});