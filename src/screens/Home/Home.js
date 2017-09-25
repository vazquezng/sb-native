import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  Platforms,
} from 'react-native';

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
      msgMatch: 'Buscando partidos para vos.'
    };
  }

  componentWillMount() {
    this.setState({ msgMatch: 'Buscando partidos para vos.' });
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
          msgMatch: 'No se encontraron partidos para vos.',
        });
      });
  }

  renderNews() {
    return (
      <View>
        <Image style={[Styles.flexColumn, { backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'flex-start', paddingBottom: 10, paddingHorizontal: 5 }]} source={require('../../assets/news1.png')}>
          <View style={[Styles.flexRow, { justifyContent: 'space-between', alignItems: 'center'}]}>
            <Text style={{ color: 'white', width: (Metrics.width*90)/100 }}>JULIO 22.2017</Text>
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('NewsDetail', { news: 1 })}
              style={{ width: (Metrics.width*10)/100 }}
            >
              <Image
                source={require('../../assets/btn-more.png')}
                style={{ width: 30, height: 25}}
              />
            </TouchableHighlight>
          </View>
        </Image>
        <View style={{ paddingHorizontal: 20, paddingTop: 5, paddingBottom: 5 }}>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('NewsDetail', { news: 1 })}
          >
            <View>
              <Text style={{ color: Colors.primary, fontSize: 20 }}>ARRANCA EL ATP</Text>
            </View>
          </TouchableHighlight>
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
    const two = Metrics.width / 2;
    const date = new Date(match.date);
    const day = new Date(date).getUTCDate();
    const hour = match.hour.split(':');
    return (
      <View key={key}>
        <View style={[Styles.flexRow, { justifyContent: 'center', marginBottom: 1, paddingBottom: 5, paddingTop: 5 }]}>
          <View style={[Styles.flexColumn,{ flex: 0.2 }]}>
            <View style={[ Styles.flexColumn, { flex: 1, paddingHorizontal: 10, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[ Styles.title, { color: 'white', marginBottom: 0}]}>{day}</Text>
              <Text style={{ color: 'white'}}>{date.toDateString().split(' ')[1].toUpperCase()}</Text>
            </View>
            <Text style={{ color: Colors.primary} }>{hour[0]}:{hour[1]}hs.</Text>
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
            onPress={() => this.props.navigation.navigate('PlayMatch', { match: match.id })}
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
            <View style={{ backgroundColor: '#414143', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 5}}>
              <Text style={[Styles.title, { color: 'white', fontSize: 26, marginTop: 2, marginBottom: 2}]}>Partidos cerca de tu ubicación</Text>
            </View>
            {this.renderNotMatchs()}
            {this.renderMatchs()}
          </View>
        </ScrollView>
        <View style={[ Styles.flexRow, { backgroundColor: '#414142', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderBottomWidth: 4, borderColor: Colors.primary } ]}>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('SearchUsers')}
            style={[ Styles.flexColumn, { justifyContent: 'center', alignItems: 'center' }]}
          >
            <View style={[ Styles.flexColumn, { justifyContent: 'space-between', alignItems: 'center'}]}>
                <Image
                  source={require('../../assets/BuscarJugadores.png')}
                  style={{ width: 24, height: 24 }}
                />
                <Text style={{ color: 'white', fontSize: 10 }}>BUSCAR JUGADORES</Text>
            </View>
          </TouchableHighlight>
          <View style={[ Styles.flexColumn, { justifyContent: 'center', alignItems: 'center', flex: 0.4, borderRightWidth: 1, borderLeftWidth: 1, borderColor: '#2d2d2e' }]}>
            <Image
              source={require('../../assets/btnc-home.png')}
              style={{ width: 80, height: 64 }}
            />
          </View>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('Match')}
            style={[ Styles.flexColumn, { justifyContent: 'center', alignItems: 'center' }]}
          >
            <View style={[ Styles.flexColumn, { justifyContent: 'center', alignItems: 'center' }]}>
              <Image
                source={require('../../assets/CrearPartido.png')}
                style={{ width: 30, height: 25 }}
              />
              <Text style={{ color: 'white', fontSize: 10 }}>CREAR PARTIDO</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}


export default HomeScreen;
