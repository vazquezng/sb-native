import React, { Component } from 'react';
import {
  Platform,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const fontRegular = Platform.OS === 'ios' ? 'Cookie' : 'CookieRegular';
const fontRobotoLight = Platform.OS === 'ios' ? 'OpenSans' : 'RobotoLight';

const commonFunc = {
  renderSpinner: (visible) => {
    return visible && Platform.OS === 'android'  ? (<Spinner visible={visible} />) : null;
  },

  isFunction: (functionToCheck) => {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  },
  pickerGameLevel: [
    { label: '2.5', value: '2.5' },
    { label: '3.0', value: '3' },
    { label: '3.5', value: '3.5' },
    { label: '4.0', value: '4' },
    { label: '4.5', value: '4.5' },
    { label: '5.0', value: '5' },
    { label: '5.5', value: '5.5' },
    { label: '6.0', value: '6' },
    { label: '6.5', value: '6.5' },
    { label: '7.0', value: '7' },
  ],
  pickerSexo: [{ label: 'Mixto', value: 'mixto' }, { label: 'Masculino', value: 'male' }, { label: 'Femenino', value: 'female' }],
  fontRegular,
  fontRobotoLight,
  isAndroid: Platform.OS === 'android',
};

export default commonFunc;
