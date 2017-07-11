import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import LoginScreen from './screens/Login';

const RoutesPaths = {
  Login: {
    screen: LoginScreen,
    path: 'login',
  },
};

const AppNavigator = StackNavigator(
  {
    ...RoutesPaths,
  }, {
    initialRouteName: 'Login',
    headerTitleStyle: {
      textAlign: 'center',
      alignSelf: 'center',
    },
    headerMode: 'none',
  });

const AppNavigatorWithState = () => <AppNavigator />;

const mapStateToProps = state => ({
  user: state.user,
});
export default connect(mapStateToProps)(AppNavigatorWithState);
