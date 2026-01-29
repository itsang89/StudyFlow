import React, { memo, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors, courseColors } from '../theme/colors';
import { spacing, getCommonStyles } from '../theme/styles';

interface CourseColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const CourseColorPicker: React.FC<CourseColorPickerProps> = memo(({
  selectedColor,
  onColorSelect,
}) => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = useMemo(() => createStyles(theme, commonStyles), [theme, commonStyles]);

  const handleColorPress = useCallback((color: string) => {
    onColorSelect(color);
  }, [onColorSelect]);

  return (
    <View style={styles.container}>
      {courseColors.map((colorOption) => (
        <TouchableOpacity
          key={colorOption.value}
          style={[
            styles.colorButton,
            { backgroundColor: colorOption.value },
            selectedColor === colorOption.value ? styles.selected : styles.unselected,
          ]}
          onPress={() => handleColorPress(colorOption.value)}
          activeOpacity={0.7}
          accessibilityLabel={`Select course color ${colorOption.name}`}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedColor === colorOption.value }}
        >
          {selectedColor === colorOption.value && (
            <MaterialIcons name="check" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
});

const createStyles = (theme: ThemeColors, commonStyles: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselected: {
    ...commonStyles.shadow,
  },
  selected: {
    ...commonStyles.shadowLarge,
    borderWidth: 2,
    borderColor: theme.white,
  },
});
