import React, { Component } from 'react';
import { AsyncStorage, View, Image  } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import SplashScreen from 'react-native-splash-screen';

import store from './store';
import AppNavigator from './AppNavigator';

const launchImage = require('./assets/logo.png');

export default class App extends Component {
  state = {
    isRehydrated: false,
  }

  componentWillMount() {
    persistStore(store, { storage: AsyncStorage }, () => {
      this.setState({ isRehydrated: true });
    });
  }

  hideSplash = () => SplashScreen.hide();

  render() {
    if (this.state.isRehydrated) {
      this.hideSplash();
      return (
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Image
          source={launchImage}
          resizeMode="contain"
          style={{ width: undefined, height: undefined }}
        />
      </View>
    )
  }
}
