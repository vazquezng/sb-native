import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
    };
  }

  render() {
    const { navigation } = this.props;
    return (
      <ScrollView>
        <Spinner visible={this.state.spinnerVisible} />
        <View>
          <Text>Profile</Text>
        </View>
      </ScrollView>
    );
  }
}


export default ProfileScreen;
