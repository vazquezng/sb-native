import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import SwipeCards from 'react-native-swipe-cards';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Card from './components/Card';
import NoMoreCards from './components/NoMoreCards';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';
import API from '@utils/api';
import commonFunc from '@utils/commonFunc';


const mapStateToProps = state => ({
  user: state.user,
});

@connect(mapStateToProps)
class SuggestedPlayersScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Queres invitar a alguien?',
    headerLeft: (
      <HeaderButton
        icon="menu"
        onPress={() => navigation.navigate('DrawerOpen')}
        tintColor={'white'}
        title={'Vuelos Baratos'}
        truncatedTitle={'vuelos'}
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
      players: [],
    };
  }

  componentWillMount() {
    const { user, navigation } = this.props;
    fetch(`${API}/match/suggested_players/${navigation.state.params.match}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      }
    })
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({
        players: responseJson.players,
      });
    });
  }

  clearUser() {
    const players = [...this.state.players];
    players.splice(0, 1);
    this.setState({
      players,
    });
  }

  invite(user_id) {
    const { user, navigation } = this.props;
    const params = { user_id: user_id, match_id: navigation.state.params.match.toString() };
    this.clearUser();

    this.setState({
      spinnerVisible: true,
    });
    fetch(`${API}/match/invite`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(params),
    })
    .then(response => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          spinnerVisible: false,
        }, () => {
          Alert.alert(
            'Atención',
            'Invitación enviada.',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
          );
        });
      } else {
        this.setState({
          spinnerVisible: false,
        }, () => {
          Alert.alert(
            'Atención',
            responseJson.errorMessage,
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
          );
        });
      }
    })
    .catch(() => {
      this.setState({
        spinnerVisible: false,
      }, () => {
        Alert.alert(
          'Error',
          'Hubo un problema, intente más tarde.',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
      });
    });
  }
  handleYup (player) {
    this.invite(player.id);
  }
  handleNope (player) {
    this.clearUser()
  }

  renderPlayers() {
    if (this.state.players.length > 0) {
      return this.renderPlayer(this.state.players[0], this.state.players[0].id);
    }

    return null;
  }

  render() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="keyboard-arrow-left"
          onPress={() => navigation.navigate(params.backName, { ...params.backParams })}
          title="Queres invitar a alguien?"
        />
        <View style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={styles.centerContent}>
            <Text style={Styles.title}>Partido</Text>
            <Text style={[Styles.subtitle, { textAlign: 'center' }]}>
              Encontra tu compañero/rival. Para enviar invitación, desliza el dedo sobre el usuario hacia la derecha. Para ver otro, desliza para la izquierda
            </Text>
          </View>
          <SwipeCards
            cards={this.state.players}
            loop={false}
            showYup={false}
            showNope={false}
            onClickHandler={() => {}}
            dragY={false}

            renderCard={ (cardData) => <Card {...cardData} navigation={this.props.navigation} clearUser={this.clearUser.bind(this)} invite={this.invite.bind(this)} />}
            renderNoMoreCards={() => <NoMoreCards />}
            handleYup={this.handleYup.bind(this)}
            handleNope={this.handleNope.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerContent: {
    marginBottom: 20,
  },
});


export default SuggestedPlayersScreen;
