import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import typography from '../styles/typography';

const About = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={[typography.heading, styles.header]}>About</Text>
      <Text style={[typography.body, styles.paragraph]}>
        {`The Quran Bookmark app helps keep track of your recitations, either it be at home or at the Mosque.\n\nSo no need to fold pages on The Holy Quran at home and taking notes of how much you read at the mosque.\n\n\nContact us:\nbitboxlife@gmail.com`}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  paragraph: {
    marginHorizontal: 8,
    padding: 20,
  },
});

export default About;
