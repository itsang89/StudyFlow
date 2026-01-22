import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { courseColors } from '../theme/colors';
import { spacing } from '../theme/styles';

interface CourseColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const CourseColorPicker: React.FC<CourseColorPickerProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  return (
    <View style={styles.container}>
      {courseColors.map((colorOption) => (
        <TouchableOpacity
          key={colorOption.value}
          style={[
            styles.colorButton,
            { backgroundColor: colorOption.value },
            selectedColor === colorOption.value && styles.selected,
          ]}
          onPress={() => onColorSelect(colorOption.value)}
          activeOpacity={0.7}
        >
          {selectedColor === colorOption.value && (
            <MaterialIcons name="check" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

