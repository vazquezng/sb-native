import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
} from 'react-native';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';
import FooterButtons from '@components/Footer/Buttons';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

import { logout } from '@store/user/actions';
import { fetchNews } from '@store/news/';

const mapStateToProps = state => ({
  user: state.user,
  news: state.news.data,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  fetchNews: () => dispatch(fetchNews()),
});

@connect(mapStateToProps, mapDispatchToProps)
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
      msgMatch: 'Buscando partidos para vos.',
    };
  }

  componentWillMount() {
    const { user, logout, navigation, screen, fetchNews } = this.props;

    this.setState({ msgMatch: 'Buscando partidos para vos.' });
    fetch(`${API}/match`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      },
    })
      .then(response => response.json())
      .then((responseJson) => {
        if (responseJson && responseJson.length) {
          if (responseJson[0] === 'Token has expired') {
            logout();
            navigation.navigate('Login');
          }
        }
        this.setState({
          matchs: responseJson.matchs,
          msgMatch: 'No se encontraron partidos para vos.',
        });
      });

      fetchNews();
  }

  renderNews() {
    const { news } = this.props;

    return (
      <View>
        <Image
          style={[Styles.flexColumn, { backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'flex-start', paddingBottom: 10, paddingHorizontal: 0, height: 150 }]}
          source={{uri: news[0].image}} resizeMode="cover">
          <View style={[Styles.flexRow, { justifyContent: 'space-between', alignItems: 'flex-end', width: Metrics.width, paddingLeft: 20 }]}>
            <Text style={{ color: 'white', flex: 0.9 }}>JULIO 22.2017</Text>
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('NewsDetail', { news: 1 })}
              style={{ flex: 0.1, justifyContent: 'flex-end' }}
            >
              <Image
                source={require('../../assets/btn-more.png')}
                style={{ width: 30, height: 25 }}
              />
            </TouchableHighlight>
          </View>
        </Image>
        <View style={{ paddingHorizontal: 20, paddingTop: 5, paddingBottom: 5 }}>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('NewsDetail', { news: news[0] })}
          >
            <View>
              <Text style={{ color: Colors.primary, fontSize: 20 }}>{news[0].title}</Text>
            </View>
          </TouchableHighlight>
          <View>
            <Text style={{ fontSize: 12 }}>{news[0].short_description}</Text>
          </View>
        </View>
      </View>

    );
  }

  renderNotMatchs() {
    if (this.state.matchs.length === 0) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text>{this.state.msgMatch}</Text>
        </View>
      );
    }

    return null;
  }

  renderMatchs() {
    return this.state.matchs.map((match, key) => this.renderMatch(match, key));
  }
  renderMatch(match, key) {
    const date = new Date(match.date);
    const day = new Date(date).getUTCDate();
    const hour = match.hour.split(':');
    return (
      <View key={key}>
        <View style={[Styles.flexRow, { justifyContent: 'center', marginBottom: 1, paddingBottom: 5, paddingTop: 5 }]}>
          <View style={[Styles.flexColumn, { flex: 0.2 }]}>
            <View style={[Styles.flexColumn, { flex: 1, paddingHorizontal: 10, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[Styles.title, { color: 'white', marginBottom: 0 }]}>{day}</Text>
              <Text style={{ color: 'white' }}>{date.toDateString().split(' ')[1].toUpperCase()}</Text>
            </View>
            <Text style={{ color: Colors.primary }}>{hour[0]}:{hour[1]}hs.</Text>
          </View>
          <View style={{ flex: 0.3 }}>
            {this.renderImage(match.user)}
          </View>
          <View style={{ flex: 0.5 }}>
            {this.renderInfoMatch(match)}
          </View>
        </View>
        <View style={[Styles.flexRow, { backgroundColor: '#ededed', paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3, justifyContent: 'space-between', alignItems: 'flex-end' }]}>
          <View>
            <Text>{match.club_name}</Text>
          </View>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('MatchDetail', { match: match.id })}
            style={[Styles.flexRow, { backgroundColor: Colors.primary, paddingRight: 5, borderRadius: 5 }]}
          >
            <Image
              source={require('../../assets/play/eye-icon.png')}
              style={{ width: 30, height: 25, borderRadius: 5 }}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  renderImage(user) {
    const imageURI = user && user.image ? user.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <TouchableHighlight
        onPress={() => this.props.navigation.navigate('ViewPlayer', { user: user.id, backName: 'Home' })}
      >
        <Image
          source={{ uri: imageURI }} style={{ width: 100,
            height: 100,
            borderRadius: 50,
            borderTopLeftRadius: 80,
            borderTopRightRadius: 80,
            borderBottomLeftRadius: 80,
            borderBottomRightRadius: 80 }}
        />
      </TouchableHighlight>
    );
  }
  renderInfoMatch(match) {
    return (
      <View style={[Styles.flexColumn]}>
        <Text style={{ color: Colors.primary, fontSize: 18, borderColor: Colors.primary, borderBottomWidth: 1, paddingBottom: 2 }}>{match.user.first_name} {match.user.last_name}</Text>
        <Text numberOfLines={2}>{match.user.about}</Text>
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
        <ScrollView
          keyboardShouldPersistTaps={'never'}
          style={[Styles.containerPrimary, { paddingHorizontal: 0 }]}
        >
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View>
            {this.renderNews()}
            <View style={{ backgroundColor: '#414143', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 5 }}>
              <Text style={[Styles.title, { color: 'white', fontSize: 26, marginTop: 2, marginBottom: 2 }]}>Partidos cerca de tu ubicación</Text>
            </View>
            {this.renderNotMatchs()}
            {this.renderMatchs()}
          </View>
        </ScrollView>

        <FooterButtons navigate={navigation.navigate} />
      </View>
    );
  }
}


export default HomeScreen;
