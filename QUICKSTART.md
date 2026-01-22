# StudyFlow - Quick Start Guide

## Running the App

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Development Server
```bash
npm start
```

This will open the Expo DevTools in your browser.

### Step 3: Run on Device/Emulator

#### iOS (Mac only)
```bash
npm run ios
```
Or press `i` in the terminal after running `npm start`

#### Android
```bash
npm run android
```
Or press `a` in the terminal after running `npm start`

#### Using Expo Go App
1. Install Expo Go on your phone from App Store or Play Store
2. Scan the QR code shown in the terminal or browser
3. The app will load on your device

## First Time Setup

When you first open the app:

1. **Add Your First Course**
   - Go to Settings tab (bottom right)
   - Tap "My Courses"
   - Tap the + button
   - Fill in course details (code, name, instructor, location)
   - Choose a color
   - Add class schedule
   - Save

2. **Create an Assignment**
   - Go to To-Do tab
   - Tap the + button
   - Enter assignment details
   - Select the course
   - Set due date
   - Choose type and priority
   - Save

3. **Start Your First Study Session**
   - Go to Home tab
   - Select a course from the dropdown
   - Tap "Start Session"
   - The timer will begin tracking your study time
   - Tap "End" when finished
   - Add optional notes
   - Save the session

4. **View Your Calendar**
   - Go to Calendar tab
   - See your classes and assignments on the calendar
   - Tap any date to see events for that day
   - Use filters to show only classes or assignments

5. **Check Your Statistics**
   - Go to Stats tab
   - View total study time
   - See study time breakdown by course
   - Review recent study sessions

## Tips

- **Course Colors**: Use different colors for each course to easily identify them in the calendar and assignment lists
- **Study Sessions**: Add notes to your study sessions to remember what you covered
- **Priorities**: Use high priority for important assignments to keep them at the top
- **Calendar**: The calendar shows dots on dates with events - tap to see details
- **Timer**: The timer continues running even if you minimize the app

## Troubleshooting

### App Won't Start
```bash
# Clear cache and restart
npx expo start -c
```

### Build Errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### TypeScript Errors
The app is fully typed with TypeScript. If you see type errors, check the `/src/types` folder for type definitions.

## Common Tasks

### Clear All Data
Settings → Data → Clear All Data

### Add Multiple Class Times
When adding/editing a course, tap "Add Time Slot" to add multiple class times for the same course (e.g., MWF at 9:00 and TTh at 11:00)

### Filter Assignments
On the To-Do screen, assignments are automatically grouped into "Due Soon" and "Later" sections

### View Week View
On the Calendar screen, tap the week view icon in the top right

## Development

### Project Structure
- `/src/screens` - All app screens
- `/src/components` - Reusable UI components
- `/src/context` - State management with Context API
- `/src/navigation` - Navigation configuration
- `/src/types` - TypeScript type definitions
- `/src/theme` - Design system (colors, typography, styles)
- `/src/utils` - Helper functions

### Adding New Features
1. Create types in `/src/types`
2. Add context provider in `/src/context` if needed
3. Create screen in `/src/screens`
4. Update navigation in `/src/navigation`
5. Use theme from `/src/theme` for consistent styling

## Support

For issues or questions, please refer to the README.md file for detailed documentation.

Enjoy using StudyFlow! 📚✨

