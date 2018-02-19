import React, { Component } from 'react';
import { AsyncStorage, View, Image } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import SplashScreen from 'react-native-splash-screen';
import Moment from 'react-moment';
import 'moment-timezone';

import { store, persistor } from './store';
import AppWithNavigationState from './AppNavigator';

import Notifications from '@utils/Notifications';

const launchImage = require('./assets/logo.png');

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

export default class App extends Component {
  hideSplash = () => SplashScreen.hide();

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppWithNavigationState />
        </PersistGate>
      </Provider>
    );
  }
}
