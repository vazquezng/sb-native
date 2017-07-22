import { StyleSheet, Dimensions, Platform } from 'react-native';

import Colors from './Colors';
const { width } = Dimensions.get('window');

const Styles = StyleSheet.create({
  containerPrimary: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  title: {
    fontFamily: 'Cookie-Regular',
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
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    marginBottom: 5,
    color: '#414142',
  },
  input: {
    fontSize: 14,
    borderBottomWidth: 0.8,
    borderColor: Colors.primary,
  },
  btnSave: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 0.6,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
});

export default Styles;
