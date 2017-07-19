/* eslint-disable react/prop-types,react/sort-comp */
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { DrawerNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Routes from './constants/routes';
import DrawerContent from './components/DrawerContent';
import DrawerItem from './components/DrawerItem';

import LoginScreen from './screens/Login';
import ProfileScreen from './screens/Profile';

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
  Login: {
    screen: LoginScreen,
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      drawerLabel: ({ focused }) => (
        <DrawerItem
          focused={focused}
          label="Profile"
          icon={<MaterialIcons name="home" size={30} style={{ color: '#9b9b9b' }} />}
          activeIcon={<MaterialIcons name="home" size={30} style={{ color: '#3F78C3' }} />}
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
