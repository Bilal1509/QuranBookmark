import { TextStyle } from 'react-native';

type Typography = {
  heading: TextStyle;
  headingWelcome: TextStyle;
  subheading: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  bodyWelcome: TextStyle;
};

const typography: Typography = {
  heading: {
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  headingWelcome: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#3C6E47',
  },
  subheading: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  body: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
  bodyWelcome: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#E5E4E2',
  },
  caption: {
    fontSize: 12,
  },
};

export default typography;
