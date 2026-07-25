import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTypography } from '../styles/typography';
import { useResponsive } from '../utils/responsive';

type WelcomeProps = {
  onGetStarted: () => void;
};

const Welcome = ({ onGetStarted }: WelcomeProps) => {
  const typography = useTypography();
  const { scale, verticalScale, moderateScale } = useResponsive();
  const styles = getStyles(scale, verticalScale, moderateScale);

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

const getStyles = (
  scale: (size: number) => number,
  verticalScale: (size: number) => number,
  moderateScale: (size: number, factor?: number) => number,
) =>
  StyleSheet.create({
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
      paddingTop: verticalScale(16),
      paddingHorizontal: '5%',
    },
    logoContainer: {
      width: scale(50),
      height: scale(50),
      borderRadius: scale(38),
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(18),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    },
    logo: {
      width: scale(40),
      height: scale(40),
      resizeMode: 'contain',
    },
    headerText: {
      fontSize: moderateScale(22),
      color: '#447055',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: scale(24),
    },
    title: {
      fontSize: moderateScale(25),
      marginBottom: verticalScale(16),
      textAlign: 'center',
    },
    message: {
      textAlign: 'center',
      lineHeight: moderateScale(24),
    },
    button: {
      backgroundColor: '#E5E4E2',
      borderRadius: moderateScale(30),
      padding: moderateScale(14),
      marginVertical: verticalScale(24),
      marginHorizontal: '25%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#447055',
      fontSize: moderateScale(18),
    },
  });

export default Welcome;
