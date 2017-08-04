import React, { Component } from 'react';
import { NavigationActions, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  NativeModules,
  Dimensions,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import Carousel from 'react-native-looped-carousel';

const { width, height } = Dimensions.get('window');
const { RNTwitterSignIn } = NativeModules;

import { login } from '@store/user/actions';

const Constants = {
    // Dev Parse keys
    TWITTER_COMSUMER_KEY: 'BZCxeNUUKOkj2WarJTv9TEGzI',
    TWITTER_CONSUMER_SECRET: 'k7VeUkRu89a41mbmuuZrQwwudh53EyrDX9iyNO2kX5blgMzy5I',
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  login: profile => dispatch(login(profile)),
});


@connect(mapStateToProps, mapDispatchToProps)
class LoginScreen extends Component {
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
  }

  constructor(props) {
    super(props);

    this.state = {
      spinnerVisible: false,
      size: { width, height },
      pager: 0,
    };

    if (props.user.isAuth) {
      props.navigation.navigate('Profile');
    }
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  _facebookLogin(data) {
    console.log(data);
    const { profile, credentials } = data;
    profile.accessToken = credentials.token;
    fetch('http://api.slambow.com/api/v1/auth', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.props.login(this.standar(responseJson));
      this.setState({
        spinnerVisible: false,
      }, () => {
        this.goProfile();
      });
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        spinnerVisible: false,
      });
    });
  }

  _twitterSignIn() {
      RNTwitterSignIn.init(Constants.TWITTER_COMSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET);
      RNTwitterSignIn.logIn()
        .then((loginData) => {
          console.log(loginData);
          const { authToken, authTokenSecret } = loginData;
          if (authToken && authTokenSecret) {
            this.setState({
              spinnerVisible: true,
            });
            fetch('http://api.slambow.com/api/v1/auth/twitter/mobile', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: loginData.userID,
                userName: loginData.userName,
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
              this.props.login(this.standar(responseJson));
              this.setState({
                spinnerVisible: false,
              }, () => {
                this.goProfile();
              });
            })
            .catch((error) => {
              console.error(error);
              this.setState({
                spinnerVisible: false,
              });
            });
          }
        }).catch((error)=> {
          Alert.alert(
            'Ups!',
            'Hubo un error, intento más tarde',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          );
        });
  }

  standar(profile) {
    return Object.assign({}, { ...profile.user, newuser: profile.newuser, token: profile.token.token});
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

  _renderBullet(index) {
    if (this.state.pager === index) {
      return (
        <View style={{ width: 7, height: 7, backgroundColor: '#ffffff', borderRadius: 7, marginHorizontal: 2 }}>
          <Text style={{ color: 'transparent', fontSize: 30 }}>{'\u2022'}{'\u2022'}{'\u2022'}</Text>
        </View>
      );
    }

    return (
      <View style={{ width: 7, height: 7, backgroundColor: 'transparent', borderRadius: 7, borderWidth: 1, borderColor: '#ffffff', marginHorizontal: 2 }}>
        <Text style={{ color: 'transparent', fontSize: 30 }}>{'\u2022'}{'\u2022'}{'\u2022'}</Text>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>
        <Carousel
          style={this.state.size}
          autoplay={false}
          pageInfo={false}
          swipe
          currentPage={0}
          onAnimateNextPage={(p) => this.setState({ pager: p })}
        >
          <View style={[{ backgroundColor: 'black'}, this.state.size]}>
            <Image style={[{ backgroundColor: 'black'}, this.state.size]} source={ require('../../assets/login01.png') }>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontFamily: 'OpenSans-Regular', fontSize: 21}}>
                  Competí con los mejores y  llevá tu tenis al mejor nivel.
                </Text>
              </View>
            </Image>
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={[{ backgroundColor: 'black'}, this.state.size]} source={ require('../../assets/login02.png') }>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontFamily: 'OpenSans-Regular', fontSize: 21}}>
                  Creá partidos y encontrá la  mejores canchas para jugar
                </Text>
              </View>
            </Image>
          </View>
          <View style={[{ backgroundColor: 'black' }, this.state.size]}>
            <Image style={[{ backgroundColor: 'black'}, this.state.size]} source={ require('../../assets/login03.png') }>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
                <Text style={{ color: '#ffffff', textAlign: 'center', fontFamily: 'OpenSans-Regular', fontSize: 21}}>
                  Noticias, sorteos, tips y  novedades para tu juego.
                </Text>
              </View>
            </Image>
          </View>
        </Carousel>
        <View style={[styles.loginContent, { bottom: 50 }]}>
          <View style={{ flexDirection: 'row', width: 200, justifyContent: 'center', marginBottom: 10 }}>
            {this._renderBullet(0)}
            {this._renderBullet(1)}
            {this._renderBullet(2)}
          </View>

          <Text style={{ color: '#ffffff', paddingLeft: 5, paddingBottom: 20 }}>Iniciá sesión y empeza a jugar</Text>
          <FBLogin
            style={{ height: null, marginBottom: 20 }}
            ref={(fbLogin) => { this.fbLogin = fbLogin; }}
            permissions={['email', 'user_friends']}
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            onLogin={data => this._facebookLogin(data)}
          />
          <TouchableOpacity
            style={{ backgroundColor: '#5baceb', height: 40, width: 200 }}
            onPress={this._twitterSignIn}
          >
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
              <Text style={{ color: 'white', fontSize: 14 }}>Login with Twitter</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute',  top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'center'}}>
          <Text style={{ color: '#ffffff', paddingBottom: 10}}>Al hacer login aceptás los términos y condiciones  </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loginContent: {
    position: 'absolute',
    bottom: 0,
    left: (width / 2) - 100
  },
  page: {
    flex: 1,
  },
});

const LoginNavigator = StackNavigator({
  Login: {
    screen: LoginScreen,
    path: 'login',
  },
}, { headerMode: 'none' });

export default LoginNavigator;
