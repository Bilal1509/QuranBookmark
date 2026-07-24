import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import typography from '../styles/typography';

type WelcomeProps = {
  onGetStarted: () => void;
};

const Welcome = ({ onGetStarted }: WelcomeProps) => {
  return (
    <LinearGradient colors={['#AFE1AF', '#3C6E47']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
          <Image source={require('../../assets/QuranIcon.png')} style={styles.logo} />
          </View>
          <Text style={[typography.heading, styles.headerText]}>Quran Bookmark</Text>
        </View>
        <View style={styles.content}>
          <Text style={[typography.headingWelcome, styles.title]}>Welcome to Quran Bookmark</Text>
          <Text style={[typography.bodyWelcome, styles.message]}>
            Explore and keep track of your recitations. Slide the list of Surahs, tap and mark
            the verses you have read.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onGetStarted}>
          <Text style={[typography.body, styles.buttonText]}>Get Started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 16,
    paddingHorizontal: '5%',
  },
  logoContainer: {
    width: 66,
    height: 66,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#E5E4E2',
    borderRadius: 30,
    padding: 14,
    marginVertical: 24,
    marginHorizontal: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#447055',
    fontSize: 18,
  },
});

export default Welcome;
