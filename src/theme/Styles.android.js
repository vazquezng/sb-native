import { StyleSheet, Dimensions, Platform } from 'react-native';

import Colors from './Colors';
const { width } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';

const Styles = StyleSheet.create({
  containerPrimary: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  title: {
    fontFamily: 'CookieRegular',
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.primary,
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: '#414142',
  },
  inputText: {
    fontFamily: 'RobotoMedium',
    fontSize: 14,
    marginBottom: 5,
    color: '#414142',
  },
  input: {
    fontSize: 14,
    borderBottomWidth: isAndroid ? 0.8 : StyleSheet.hairlineWidth,
    borderColor: Colors.primary,
    paddingBottom: 5,
    height: 28,
  },
  inputDisabled: {
    fontSize: 14,
    borderBottomWidth: isAndroid ? 0.8 : StyleSheet.hairlineWidth,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    borderColor: Colors.primary,
  },
  btnSave: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: isAndroid ? 0.8 : StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexAlignLeft: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default Styles;
