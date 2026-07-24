import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import { useTypography } from '../styles/typography';
import { useResponsive } from '../utils/responsive';

type TabIconProps = {
  icon: ImageSourcePropType;
  color: string;
  focused: boolean;
  name: string;
};

const TabIcon = ({ icon, color, focused, name }: TabIconProps) => {
  const typography = useTypography();
  const { scale, moderateScale } = useResponsive();

  return (
    <View style={styles.container}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: scale(24), height: scale(24) }}
      />
      <Text
        style={[
          typography.caption,
          styles.label,
          { color, fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular', fontSize: moderateScale(18) },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        // minimumFontScale={0.8}
      >
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // gap: 8,
  },
  label: {
    textAlign: 'center',
  },
});

export default TabIcon;
