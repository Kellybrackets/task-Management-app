# 📋 Task Management App - React Native Prototype

![Task Management Demo](task-demo.gif) *<!-- Replace with your demo GIF -->*

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2048-purple)](https://expo.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

> **Your productivity powerhouse** - A sleek task management app built with React Native and TypeScript for seamless cross-platform performance.

## 🚀 Features

### ✨ Core Functionality
| Feature | Status | Tech Used |
|---------|--------|-----------|
| Task Creation | ✅ | React Hook Form |
| Drag & Drop | ✅ | React Native Reanimated |
| Dark Mode | ✅ | Context API |
| Offline Sync | 🚧 | AsyncStorage |
| Team Collaboration | ⏳ | Socket.IO |

### 📱 UI Components
```bash
componentDiagram
    App --> TaskList
    TaskList --> TaskItem
    App --> AddTaskModal
    App --> SettingsPanel
```
🛠️ Tech Stack
Frontend

React Native 0.72

TypeScript 4.9

Expo SDK 48

React Navigation 6.x

State Management

Context API

React Query

Styling

Tailwind CSS (NativeWind)

React Native Reanimated
🏗️ Project Structure
```
task-management-app/
├── app/               # Core navigation
├── components/        # Reusable components
│   ├── TaskItem.tsx
│   └── PriorityBadge.tsx
├── hooks/             # Custom hooks
├── types/             # TypeScript definitions
├── assets/            # Images & icons
├── app.json           # Expo config
└── package.json       # Dependencies
```

💻 Quick Start
``` bash
# Clone repository
git clone https://github.com/Kellybrackets/task-Management-app.git

# Install dependencies
npm install

# Start development server
expo start
```

🎨 UI Preview
```
tsx
// Sample component from components/TaskItem.tsx
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TaskItem = ({ task }: { task: Task }) => (
  <Pressable className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
    <Text className="text-gray-900 dark:text-white">
      {task.title}
    </Text>
  </Pressable>
);
```

### 📈 Roadmap
Basic Task CRUD

Dark Mode Support

Collaborative Editing

Calendar Integration

Analytics Dashboard

### 🤝 How to Contribute
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request
