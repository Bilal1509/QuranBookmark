import { TextStyle } from 'react-native';

type Typography = {
  heading: TextStyle;
  subheading: TextStyle;
  body: TextStyle;
  caption: TextStyle;
};

const typography: Typography = {
  heading: {
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
    color: '#000',
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
  caption: {
    fontSize: 12,
  },
};

export default typography;
