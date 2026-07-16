import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import typography from '../styles/typography';

type TabIconProps = {
  icon: ImageSourcePropType;
  color: string;
  focused: boolean;
  name: string;
};

const TabIcon = ({ icon, color, focused, name }: TabIconProps) => {
  return (
    <View style={styles.container}>
      <Image source={icon} resizeMode="contain" tintColor={color} style={styles.icon} />
      <Text
        style={[
          typography.caption,
          styles.label,
          { color, fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular' },
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
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export default TabIcon;
