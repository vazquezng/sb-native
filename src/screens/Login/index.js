import React, { Component } from 'react';
import { NavigationActions, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
    };
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.loginContainer}>
        <Spinner visible={this.state.spinnerVisible} />
        <Image style={styles.loginContent} source={require('../../assets/background.png')}>
          <FBLogin
            style={{ height: null, paddingBottom: 30, marginBottom: 20 }}
            ref={(fbLogin) => { this.fbLogin = fbLogin; }}
            permissions={['email', 'user_friends']}
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            onLogin={(data) => {
              console.log("Logged in!");
              console.log(data);
              this.setState({ user : data.credentials });
            }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View>
              <Text style={{ color:'white', fontSize: 20 }}>Twitter</Text>
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
  },
});

const LoginNavigator = StackNavigator({
  Login: {
    screen: LoginScreen,
    path: 'login',
  },
}, { headerMode: 'none' });

export default LoginNavigator;
