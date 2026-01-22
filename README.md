# StudyFlow

A beautiful, modern mobile app built with React Native and Expo to help students organize their academic schedule, track assignments, and build consistent study habits through time tracking and analytics.

## Features

### 📚 Course Management
- Add, edit, and delete courses
- Set course details (name, code, instructor, location)
- Assign custom colors to each course
- Configure recurring class schedules with day and time

### ✅ Assignment & Deadline Tracking
- Create assignments, exams, and projects
- Set priorities (low, medium, high)
- Link assignments to courses
- Mark assignments as complete
- Filter by course, status, and priority
- Visual progress tracking

### ⏱️ Study Timer
- Start study sessions linked to specific courses
- Pause and resume functionality
- Background timer support (continues when app is minimized)
- Session completion with duration display
- Optional notes for each study session
- Automatic session history saving

### 📅 Calendar Views
- Monthly calendar with event indicators
- Day view showing all events
- Week view support
- Color-coded events by course
- Filter by event type (All/Classes/Assignments/Exams)

### 📊 Statistics & Analytics
- Total study time (all-time and weekly)
- Study time breakdown by course (pie chart)
- Weekly activity trend (bar chart)
- Study session history
- Performance insights
- Percentage change tracking

### ⚙️ Settings & Personalization
- User profile management
- Theme toggle (light/dark mode)
- Notification preferences
- Data management (clear all data)
- App information

## Tech Stack

- **Framework**: Expo SDK 51 with TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State Management**: Context API with useReducer
- **Local Storage**: AsyncStorage
- **Calendar**: react-native-calendars
- **Charts**: react-native-chart-kit
- **UI/UX**: Custom glassmorphism design system
- **Icons**: @expo/vector-icons (MaterialIcons)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd StudyFlow
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on iOS or Android
```bash
npm run ios
# or
npm run android
```

## Project Structure

```
StudyFlow/
├── App.tsx                 # Main app entry point
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── GlassCard.tsx
│   │   ├── AgendaItem.tsx
│   │   ├── CourseColorPicker.tsx
│   │   └── ...
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── TimerScreen.tsx
│   │   ├── AssignmentsScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── StatisticsScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── ...
│   ├── navigation/        # Navigation configuration
│   │   ├── BottomTabNavigator.tsx
│   │   └── types.ts
│   ├── context/          # State management
│   │   ├── AppProvider.tsx
│   │   ├── CourseContext.tsx
│   │   ├── AssignmentContext.tsx
│   │   ├── StudySessionContext.tsx
│   │   └── SettingsContext.tsx
│   ├── types/            # TypeScript type definitions
│   │   ├── course.ts
│   │   ├── assignment.ts
│   │   ├── studySession.ts
│   │   └── settings.ts
│   ├── theme/            # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── styles.ts
│   └── utils/            # Helper functions
│       ├── storage.ts
│       ├── dateHelpers.ts
│       └── timeHelpers.ts
```

## Key Features Implementation

### Data Persistence
All data is stored locally using AsyncStorage with automatic JSON serialization and date reviving.

### Glassmorphism UI
Custom design system with:
- Frosted glass effect cards
- Blur backgrounds
- Subtle shadows and borders
- Consistent spacing and typography

### Context-Based State Management
Efficient state management using React Context API with:
- Separate contexts for different data domains
- useReducer for complex state logic
- Automatic persistence to AsyncStorage

### Navigation
Custom bottom tab navigator with:
- Glassmorphism styling
- Active state indicators
- Smooth transitions
- Stack navigation for nested screens

## Data Models

### Course
```typescript
{
  id: string;
  name: string;
  code: string;
  instructor: string;
  location: string;
  color: string;
  schedule: Array<{
    day: number; // 0-6 (Sun-Sat)
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
  }>;
  createdAt: Date;
}
```

### Assignment
```typescript
{
  id: string;
  title: string;
  courseId: string;
  dueDate: Date;
  type: 'assignment' | 'exam' | 'project';
  priority: 'low' | 'medium' | 'high';
  description: string;
  completed: boolean;
  completedDate?: Date;
  createdAt: Date;
}
```

### StudySession
```typescript
{
  id: string;
  courseId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // seconds
  notes: string;
  date: Date;
}
```

## Design System

### Colors
- Background: #F4F7F9, #F9F9F9
- Glass: rgba(255, 255, 255, 0.4) with backdrop blur
- Primary: #13a4ec, #4A90E2
- Text: #1A1C1E (charcoal)
- Labels: #6B7280

### Typography
- Font: Inter (system fallback to SF Pro)
- Headings: 64px, 40px, 32px, 24px
- Body: 16px, 14px, 12px
- Labels: 10-11px uppercase with letter-spacing

## Future Enhancements

- Push notifications for class reminders and assignment alerts
- Cloud sync and backup
- Study streaks and gamification
- Pomodoro timer integration
- Study groups and collaboration
- Export study data and reports
- Widget support

## License

MIT

## Acknowledgments

Design inspiration from modern productivity apps with emphasis on clean, minimalist interfaces and glassmorphism aesthetics.

