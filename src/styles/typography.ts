import { TextStyle } from 'react-native';
import { useResponsive } from '../utils/responsive';

type Typography = {
  heading: TextStyle;
  headingWelcome: TextStyle;
  subheading: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  bodyWelcome: TextStyle;
};

export const useTypography = (): Typography => {
  const { moderateScale } = useResponsive();

  return {
    heading: {
      fontSize: moderateScale(25),
      fontFamily: 'Poppins-Bold',
      color: '#000',
    },
    headingWelcome: {
      fontSize: moderateScale(25),
      fontFamily: 'Poppins-SemiBold',
      color: '#3C6E47',
    },
    subheading: {
      fontSize: moderateScale(20),
      fontFamily: 'Poppins-Bold',
      color: '#000',
    },
    body: {
      fontSize: moderateScale(15),
      fontFamily: 'Poppins-SemiBold',
      color: '#000',
    },
    bodyWelcome: {
      fontSize: moderateScale(19),
      fontFamily: 'Poppins-SemiBold',
      color: '#E5E4E2',
    },
    caption: {
      fontSize: moderateScale(12),
    },
  };
};
