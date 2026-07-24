import { useWindowDimensions } from 'react-native';

// Baseline design size (iPhone X / standard 375x812 portrait phone).
const GUIDELINE_WIDTH = 375;
const GUIDELINE_HEIGHT = 812;

// Cap the effective dimensions used for scaling so tablets/large screens
// don't blow fonts and spacing up proportionally to their full width.
const MAX_SCALE_WIDTH = 480;
const MAX_SCALE_HEIGHT = 900;

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const effectiveWidth = Math.min(width, MAX_SCALE_WIDTH);
  const effectiveHeight = Math.min(height, MAX_SCALE_HEIGHT);

  const scale = (size: number) => (effectiveWidth / GUIDELINE_WIDTH) * size;
  const verticalScale = (size: number) => (effectiveHeight / GUIDELINE_HEIGHT) * size;
  const moderateScale = (size: number, factor = 0.5) =>
    size + (scale(size) - size) * factor;
  const moderateVerticalScale = (size: number, factor = 0.5) =>
    size + (verticalScale(size) - size) * factor;

  return { width, height, scale, verticalScale, moderateScale, moderateVerticalScale };
};
