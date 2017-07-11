import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { FBLoginManager } from 'react-native-facebook-login';

const { height } = Dimensions.get('window');
const iOS = Platform.OS === 'ios';

class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
    headerTitleStyle: {
      textAlign: 'center',
      alignSelf: 'center',
    },
    headerLeft: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
    }
  }

  logIn= () => {

  };
  render() {
    const { navigation } = this.props;
    const { isValid, error } = this.state;
    const isValidStyles = isValid ? styles.loginInputBorder : styles.loginInputError;
    return (
      <ScrollView style={styles.loginContainer}>
        <Spinner visible={this.state.spinnerVisible} />
        <View style={styles.loginContent}>
          <View>
            <FBLogin />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loginHeaderContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginLogoImage: {
    width: 199,
    height: 44,
  },
  loginContent: {
    flexGrow: 1,
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 10,
  },
  loginForm: {
    marginBottom: 10,
    justifyContent: 'center',
  },
  loginInputContainer: {
    borderBottomWidth: iOS ? 0.3 : null,
    borderBottomColor: iOS ? 'grey' : null,
  },
  loginInputText: {
    marginTop: 10,
    color: '#000',
    fontSize: 15,
  },
  loginContinuar: {
    backgroundColor: '#45caac',
    height: 45,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContinuarText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  loginInputError: {
    borderBottomColor: 'red',
    borderBottomWidth: 2,
  },
  loginInputBorder: {
    borderBottomColor: '#adadaf',
    borderBottomWidth: 1,
  },
  buttonSignUp: {},
  signUp: {
    color: '#45caac',
  },
});


export default LoginScreen;
