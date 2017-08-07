import React, { Component } from 'react';
import {
  Platform,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const commonFunc = {
  renderSpinner: (visible) => {
    return visible && Platform.OS === 'android'  ? (<Spinner visible={visible} />) : null;
  },

  isFunction: (functionToCheck) => {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  },
};

export default commonFunc;
