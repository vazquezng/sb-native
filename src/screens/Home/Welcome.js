import React, { Component } from 'react';
import { NavigationActions, StackNavigator } from 'react-navigation';
import {
  View,
  Image,
  StyleSheet,
  Text
} from 'react-native';

import Styles from '@theme/Styles';
import Metrics from '@theme/Metrics';

import TouchableItem from '@components/TouchableItem';
import commonFunc from '@utils/commonFunc';


class WelcomeScreen extends Component {
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
  }

  goProfile() {
    const resetAction = NavigationActions.reset({
      routeName: 'Profile',
      params: {},

      // navigate can have a nested navigate action that will be run inside the child router
      action: NavigationActions.navigate({ routeName: 'Profile' })
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    console.log(this.props);
    const height = (Metrics.screenHeight * 80) / 100;
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Image style={[{ backgroundColor: 'black', paddingTop: 85, width: commonFunc.width, height }]} source={ require('../../assets/welcome.png') }>
          <Text style={[Styles.title, { color: 'white', backgroundColor: 'transparent' }]}>¡Hola!</Text>
          <Text style={[Styles.title, { marginBottom: 0, backgroundColor: 'transparent' }]}>Bienvenidos a</Text>
          <Image source={require('../../assets/logo2.png')} resizeMode="contain" style={{ width: 200, height: 50, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} />
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 165, 215, 0.5)', height: 60, marginTop: 30 }}>
            <Text style={{ color: 'white', fontSize: 14 }}>
              TE INVITAMOS A COMPLETAR {'\n'}
              ALGUNOS DATOS PARA JUGAR
            </Text>
          </View>
        </Image>
        <View style={{ backgroundColor: 'white', height: (Metrics.screenHeight * 15) / 100, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableItem
            style={{ backgroundColor: '#00a5d7', height: 50, width: 300, borderRadius: 5 }}
            onPress={() => this.goProfile()}
          >
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{ color: 'white', fontSize: 20, backgroundColor: 'transparent'  }}>EMPEZAR</Text>
            </View>
          </TouchableItem>
        </View>
      </View>
    );
  }
}

const WelcomeNavigator = StackNavigator({
  Login: {
    screen: WelcomeScreen,
    path: 'welcome',
  },
}, { headerMode: 'none' });

export default WelcomeNavigator;
