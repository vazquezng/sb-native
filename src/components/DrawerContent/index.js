import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { DrawerItems } from 'react-navigation';
import compose from 'recompose/compose';

import Routes from '../../constants/routes';

const logo = require('../../assets/logo.png');

const isAuth = route => Routes.isAuthRoutes.includes(route.routeName);

const enhance = compose(
  connect(state => ({
    user: state.user,
  })),
);

@enhance
export default class DrawerContent extends Component {

  state = {
    firstTime: true,
  }

  componentWillMount() {
    const { navigation } = this.props;
    // this.notifications = new Notifications(navigation);

    if (this.state.firstTime && !this.props.user.isAuth) {
      this.setState({ firstTime: false });
      // navigation.navigate('Login');
    }
  }

  componentDidMount() {
    // this.notifications.on();
  }

  componentWillUnmount() {
    // this.notifications.off();
  }

  getFilteredRoutes = () => {
    const { navigation } = this.props;
    const stackedRoutes = navigation.state.routes;

    const routes = stackedRoutes.filter(isAuth);
    return { routes };
  }

  render() {
    const { user, navigation } = this.props;
    const allowedRoutes = navigation;

    allowedRoutes.state = this.getFilteredRoutes();

    const itemsProps = {
      ...this.props,
      navigation: allowedRoutes,
      items: navigation.state.routes.filter(isAuth),
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 3, backgroundColor: 'transparent' }}>
          <Text>Nicolas</Text>
        </View>
        <DrawerItems {...itemsProps} style={{ flex: 7 }} />
      </View>
    );
  }
}
