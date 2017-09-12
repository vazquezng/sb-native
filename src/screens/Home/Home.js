import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const mapStateToProps = state => ({
  user: state.user,
});

@connect(mapStateToProps)
class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Profile',
    headerLeft: (
      <HeaderButton
        icon="menu"
        onPress={() => navigation.navigate('DrawerOpen')}
        tintColor={'white'}
      />
    ),
    headerStyle: {
      backgroundColor: '#3f78c3',
    },
    headerTintColor: 'white',
  });

  constructor(props) {
    super(props);

    this.state = {
      spinnerVisible: false,
      matchs: [],
    };
  }

  componentWillMount() {
    fetch(`${API}/match`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.user.profile.token}`,
      },
    })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          matchs: responseJson.matchs,
        });
      });
  }

  renderNews() {
    return (
      <View>
        <Image style={[Styles.flexColumn, { backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'flex-start', paddingBottom: 10, paddingHorizontal: 5 }]} source={require('../../assets/news1.png')}>
          <View style={[Styles.flexRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={{ color: 'white', flex: 0.8 }}>JULIO 22.2017</Text>
            <TouchableItem
              onPress={() => this.props.navigation.navigate('NewsDetail', { news: 1 })}
              style={{ flex: 0.2 }}
            >
              <Image
                source={require('../../assets/btn-more.png')}
                style={{ width: 30, height: 25}}
              />
            </TouchableItem>
          </View>
        </Image>
        <View style={{ paddingHorizontal: 20, paddingTop: 5, paddingBottom: 5 }}>
          <View>
            <Text style={{ color: Colors.primary, fontSize: 20 }}>ARRANCA EL ATP</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
          </View>
        </View>
      </View>

    );
  }

  renderNotMatchs() {
    if (this.state.matchs.length === 0) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text>No hay partidos en este momento</Text>
        </View>
      );
    }

    return null;
  }

  renderMatchs() {
    return this.state.matchs.map((match, key) => {
      return this.renderMatch(match, key);
    });
  }
  renderMatch(match, key) {
    const two = Metrics.width / 2;
    return (
      <View key={key} style={[Styles.flexRow, { flex: 1, justifyContent: 'center', marginBottom: 1, borderBottomWidth: 0.8, paddingBottom: 10 }]}>
        <View style={{ width: two }}>
          {this.renderImage(match.user)}
        </View>
        <View style={{ width: two }}>
          {this.renderInfoMatch(match)}
        </View>
      </View>
    );
  }

  renderImage(user) {
    console.log(user);
    const imageURI = user && user.image ? user.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: 100,
          height: 100,
          borderRadius: 50,
          borderTopLeftRadius: 80,
          borderTopRightRadius: 80,
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80 }}
      />
    );
  }
  renderInfoMatch(match) {
    return (
      <View style={Styles.flexColumn}>
        <Text style={{ color: '#000000', fontSize: 18, borderColor: Colors.primary, borderBottomWidth: 1, paddingBottom: 2 }}>{match.user.first_name} {match.user.last_name}</Text>
        <Text style={{ color: Colors.primary, fontFamily: commonFunc.fontRegular, fontSize: 16 }}>{match.date} - {match.hour}</Text>
        <Text style={{ color: '#000000', fontSize: 12, borderColor: Colors.primary, borderBottomWidth: 1, paddingBottom: 2, marginTop: 10 }}>{match.club_name}</Text>
        <Text numberOfLines={1}>{match.address}</Text>
        <TouchableItem
          onPress={() => this.props.navigation.navigate('PlayMatch', { match: match.id })}
        >
          <Image
            source={require('../../assets/play/eye-icon.png')}
            style={{ width: 30, height: 25}}
          />
        </TouchableItem>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="menu"
          onPress={() => navigation.navigate('DrawerOpen')}
          title="Home"
        />
        <KeyboardAwareScrollView
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={'never'}
          getTextInputRefs={() => [this._about]}
          style={[Styles.containerPrimary, { paddingHorizontal: 0 }]}
        >
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View>
            {this.renderNews()}
            <View style={{ backgroundColor: '#414143', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 5}}>
              <Text style={[Styles.title, { color: 'white', fontSize: 26, marginTop: 2, marginBottom: 2}]}>Partidos cerca de tu ubicación</Text>
            </View>
            {this.renderNotMatchs()}
            {this.renderMatchs()}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


export default HomeScreen;
