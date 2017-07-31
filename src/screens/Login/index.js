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
  Platform,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
const { RNTwitterSignIn } = NativeModules;

import { login } from '@store/user/actions';
import Metrics from '@theme/Metrics';

const loginBehavior = (Platform.OS === 'ios') ? FBLoginManager.LoginBehaviors.Web : FBLoginManager.LoginBehaviors.Native;
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
  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
    };

    if (props.user.isAuth) {
      props.navigation.navigate('Profile');
    }
  }

  _facebookLogin(data) {
    console.log(data);
    let { profile, credentials } = data;
    if (!profile) profile = {};

    profile.accessToken = credentials.token;
    profile.id = credentials.userId;
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
      action: NavigationActions.navigate({ routeName: 'Profile'})
    });
    this.props.navigation.dispatch(resetAction);
    // this.props.navigation.navigate('Profile');
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.loginContainer}>
        <Spinner visible={this.state.spinnerVisible} />
        <Image style={styles.loginContent} source={require('../../assets/background.png')}>
          <FBLogin
            style={{ paddingBottom: 30, marginBottom: 20 }}
            ref={(fbLogin) => { this.fbLogin = fbLogin; }}
            permissions={['email', 'user_friends']}
            loginBehavior={loginBehavior}
            onLogin={data => this._facebookLogin(data)}
          />
          <TouchableOpacity
            style={{
              width: (Metrics.screenWidth/2),
              backgroundColor: '#5baceb',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 5,
              paddingBottom: 5,
              paddingHorizontal: 15,
              borderRadius: 2,
            }}
            onPress={this._twitterSignIn.bind(this)}
          >
            <View>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>Log in with Twitter</Text>
            </View>
          </TouchableOpacity>

        </Image>
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
    flex: 1,
    width: null,
    height: null,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

const LoginNavigator = StackNavigator({
  Login: {
    screen: LoginScreen,
    path: 'login',
  },
}, { headerMode: 'none' });

export default LoginNavigator;
