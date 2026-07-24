import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTypography } from '../styles/typography';
import { useResponsive } from '../utils/responsive';

const About = () => {
  const typography = useTypography();
  const { scale, moderateScale } = useResponsive();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[typography.heading, { padding: moderateScale(20) }]}>About</Text>
      <Text
        style={[
          typography.body,
          { marginHorizontal: scale(8), padding: moderateScale(20) },
        ]}
      >
        {`The Quran Bookmark app helps keep track of your recitations, either it be at home or at the Mosque.\n\nSo no need to fold pages on The Holy Quran at home and taking notes of how much you read at the mosque.\n\n\nContact us:\napplication.dev1509@gmail.com`}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default About;
