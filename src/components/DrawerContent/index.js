import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { DrawerItems } from 'react-navigation';
import compose from 'recompose/compose';
import { FBLoginManager } from 'react-native-facebook-login';

import TouchableItem from '../TouchableItem';
import Routes from '../../constants/routes';
import Colors from '@theme/Colors';
import { logout } from '@store/user/actions';

const logo = require('../../assets/logo.png');

const isAuth = route => Routes.isAuthRoutes.includes(route.routeName);

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
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
    console.log(routes);
    return { routes };
  }

  handleLogout = () => {
    FBLoginManager.logout((err, data) => console.log(err, data));
    this.props.logout();
    this.props.navigation.navigate('Login');
  }

  renderImage() {
    const { user } = this.props;
    const imageURI = user && user.profile  && user.profile.image ? user.profile.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: 40,
          height: 40,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          marginRight: 20 }}
      />
    );
  }

  render() {
    const { user, navigation } = this.props;
    const allowedRoutes = navigation;
    const name = user && user.profile ? user.profile.name : '';
    allowedRoutes.state = this.getFilteredRoutes();

    const itemsProps = {
      ...this.props,
      navigation: allowedRoutes,
      items: navigation.state.routes.filter(isAuth),
    };

    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <View style={styles.containerUser}>
          {this.renderImage()}
          <Text style={{ color: 'rgb(7, 161, 217)', fontSize: 20 }}>{name}</Text>
        </View>
        <DrawerItems {...itemsProps} style={{ flex: 7 }} />
        <TouchableItem
            onPress={this.handleLogout}
            pressColor={'white'}
            delayPressIn={0}
            style={styles.logoutContainer}
          >
            <View pointerEvents="box-only" style={styles.logoutContainerText}>
              <Text style={styles.logoutText}>
                Cerrar Sesión
              </Text>
            </View>
          </TouchableItem>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerUser: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#b2b2b2',
    paddingLeft: 15,
  },
  logoutContainer: {
    height: Platform.OS === 'ios' ? 44 : 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  logoutContainerText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
  },
});
