import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
// const screenWidth = width < height ? width : height;
// const screenHeight = width < height ? height : width;
const screenWidth = width;
const screenHeight = height;
const defaultMargin = 20;
const defaultPadding = 20;
const defaultComponentHeight = 45;

const metrics = {
  screenWidth: screenWidth,
  screenHeight: screenHeight,

  navBarHeight: 60,
  tabHeight: 50,

  defaultMargin: defaultMargin,
  defaultPadding: defaultPadding,

  defaultComponentHeight:defaultComponentHeight,
  defaultTextPaddingLeft: Platform.OS === 'ios'? 0 : -10,
  buttonWidth: screenWidth - defaultPadding * 2,
  buttonHeight: defaultComponentHeight,
};

export default metrics;
