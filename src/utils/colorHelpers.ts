/**
 * Helper to add opacity to a hex color string
 * @param color Hex color string (e.g. '#FF0000')
 * @param opacity Opacity in hex (e.g. '1A' for 10%, '33' for 20%)
 * @returns Hex color string with opacity
 */
export const addOpacity = (color: string, opacity: string): string => {
  // Simple check for valid hex color
  if (!color || !color.startsWith('#')) return color;
  
  // If it's already an 8-digit hex, replace or append
  if (color.length === 9) {
    return color.substring(0, 7) + opacity;
  }
  
  return color + opacity;
};
