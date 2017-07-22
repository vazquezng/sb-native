/* eslint-disable react/prop-types,react/sort-comp */
import React, { Component } from 'react';
import { Platform, Image } from 'react-native';
import { connect } from 'react-redux';
import { DrawerNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Routes from './constants/routes';
import DrawerContent from './components/DrawerContent';
import DrawerItem from './components/DrawerItem';

import LoginScreen from './screens/Login';
import ProfileScreen from './screens/Profile';
import MatchScreen from './screens/Match';
import PlayScreen from './screens/Play';
import MatchHistoryScreen from './screens/MatchHistory';
import MyCalificationsScreen from './screens/MyCalifications';

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

const AuthNavigationDrawer = lang => DrawerNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Mi Perfil"
          icon={<Image source={require('./assets/profile-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/profile-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  Login: {
    screen: LoginScreen,
  },
  Match: {
    screen: MatchScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Crear Partido"
          icon={<Image source={require('./assets/ico-crear-partido.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/ico-crear-partido.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  Play: {
    screen: PlayScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Quiero Jugar"
          icon={<Image source={require('./assets/ico-quiero-jugar.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/ico-quiero-jugar.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  MatchHistory: {
    screen: MatchHistoryScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Mis Partidos"
          icon={<Image source={require('./assets/match-history-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/match-history-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
  MyCalifications: {
    screen: MyCalificationsScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Mis Calificaciones"
          icon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
          activeIcon={<Image source={require('./assets/my-califications-icon.png')} style={{ width: 24, height: 24}} />}
        />
      ),
    },
  },
}, {
  initialRouteName: 'Login',
  contentComponent: DrawerContent,
  contentOptions: {
    items: Routes.isAuthRoutes,
    activeTintColor: '#3F78C3',
  },
});
class AppNavigator extends Component {
  state = {
    loaded: true,
  };
  shouldComponentUpdate(nextProps) {
    if (this.props.renderAuth !== nextProps.renderAuth) {
      this.setState({ loaded: false });
      return true;
    }

    return false;
  }

  render() {
    const config = {
      scheme: 'grupodc.turismocity',
    };
    // const { resources, currentCountry } = this.props;
    // const lang = currentCountry ? currentCountry.lang.replace(/-/, '_').toLowerCase() : 'es_ar';
    const AppNavigatorDrawerContainer = AuthNavigationDrawer('es_ar');
    const prefix = Platform.OS === 'android'
      ? `${config.scheme}://${config.scheme}/` : `${config.scheme}://`;

    return (
      <AppNavigatorDrawerContainer
        uriPrefix={prefix}
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getCurrentRouteName(currentState);
          const prevScreen = getCurrentRouteName(prevState);

          if (prevScreen !== currentScreen) {
            // tracker.trackScreenView(currentScreen);
          }
        }}
      />
    );
  }

}
const AppNavigatorWithState = () => <AppNavigator />;

const mapStateToProps = state => ({
  user: state.user,
});
export default connect(mapStateToProps)(AppNavigatorWithState);
