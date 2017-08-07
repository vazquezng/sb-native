import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  BackHandler,
  Alert,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

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
            'Error',
            'Hubo un problema, intente más tarde.',
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

  renderNotPlayers() {
    if (this.state.players.length === 0) {
      return (
        <View style={Styles.flexRow}>
          <View style={{ justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[Styles.subtitle, { textAlign: 'center', selfAlign: 'center' }]}>No se encontraron usuarios con las especificaciones</Text>
          </View>
        </View>
      );
    }

    return null;
  }

  renderPlayers() {
    if (this.state.players.length > 0) {
      return this.renderPlayer(this.state.players[0], this.state.players[0].id);
    }

    return null;
  }

  renderPlayer(player, index) {
    const imageURI = player && player.image ? player.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <View key={index} style={[Styles.flexColumn, { borderColor: Colors.second, borderWidth: 0.8, borderRadius: 50, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10 }]}>
        <TouchableItem
          onPress={() => this.props.navigation.navigate('ViewPlayer', { user: player.id, backName: 'SuggestedPlayers', backParams: { match: this.props.navigation.state.params.match } })}
        >
          <View style={{ marginBottom: 10 }}>
            <Image
              source={{ uri: imageURI }} style={{ width: 160,
                height: 160,
                borderRadius: 80,
                borderTopLeftRadius: 100,
                borderTopRightRadius: 100,
                borderBottomLeftRadius: 100,
                borderBottomRightRadius: 100 }}
            />
          </View>
        </TouchableItem>
        <View style={{ backgroundColor: 'rgba(204, 204, 208, 0.3)', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 5, width: 100, marginBottom: 10 }}>
          <Text style={{ color: Colors.primary, textAlign: 'center' }}>{player.first_name}</Text>
          <Text style={{ textAlign: 'center' }}>{player.last_name}</Text>
        </View>
        <View style={{ backgroundColor: 'rgba(204, 204, 208, 0.3)', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 5, width: 100, marginBottom: 10 }}>
          <Text style={{ color: Colors.primary, textAlign: 'center' }}>Nivel</Text>
          <Text style={{ textAlign: 'center' }}>{player.game_level}</Text>
        </View>
        <View style={[Styles.flexRow, { justifyContent: 'space-between', flex: 1 }]}>
          <TouchableItem onPress={() => this.clearUser()} style={{ marginRight: 10 }}>
            <Entypo name="circle-with-cross" size={30} />
          </TouchableItem>
          <TouchableItem onPress={() => this.invite(player.id)} style={{ marginLeft: 10 }}>
            <Entypo name="circle-with-plus" size={30} style={{ color: Colors.primary }} />
          </TouchableItem>
        </View>
      </View>
    );
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
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={styles.centerContent}>
            <Text style={Styles.title}>Partido</Text>
            <Text style={[Styles.subtitle, { textAlign: 'center' }]}>Encontra un compañero/rival</Text>
          </View>
          {this.renderNotPlayers()}
          {this.renderPlayers()}
        </ScrollView>
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
