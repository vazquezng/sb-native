import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Picker,
  Alert,
  Dimensions,
} from 'react-native';
import moment from 'moment';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';
import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const stateInvite = {
  confirmed: 'confirmed',
};

const mapStateToProps = state => ({
  user: state.user,
});
@connect(mapStateToProps)
class MatchDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Detalle del Partido',
    headerLeft: (
      <HeaderButton
        icon="keyboard-arrow-left"
        onPress={() => navigation.navigate('MatchHistory')}
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
      match: null,
      modalMaps: false,
    };
  }

  componentWillMount() {
    const { user, navigation } = this.props;
    this.setState({
      spinnerVisible: true,
    });
    fetch(`${API}/match/${navigation.state.params.match}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      }
    })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          isPlayer: responseJson.isPlayer,
          match: responseJson.match,
          spinnerVisible: false,
        });
      });
  }

  acceptUser(match, player) {
    const params = { id_user: player, id_match: match, state: 'confirmed' };
    this.sendUpdatePlayerRequest(params, 'Confirmaste al usuario!', 'No se pudo confirmar el usuario');
  }

  refuseUser(match, player) {
    const params = { id_user: player, id_match: match, state: 'rejected' };
    this.sendUpdatePlayerRequest(params, 'Rechazaste al usuario!', 'No se pudo rechazar el usuario');
  }

  acceptMatch(match, player) {
    const params = { id_user: player, id_match: match, state: 'confirmed' };
    this.sendUpdatePlayerRequest(params, 'Confirmaste el partido!', 'No se pudo confirmar el partido.');
  }

  refuseMatch(match, player) {
    const params = { id_user: player, id_match: match, state: 'invitationDeclined' };
    this.sendUpdatePlayerRequest(params, 'Rechazaste el partido!', 'No se pudo rechazar el partido');
  }

  sendUpdatePlayerRequest(params, msjSucces, mjsError) {
    const { user } = this.props;
    this.setState({
      spinnerVisible: true,
    }, () => {
      fetch(`${API}/match/updatePlayerRequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.profile.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
        .then(response => response.json())
        .then((responseJson) => {
          this.setState({
            spinnerVisible: false,
          });

          if (responseJson.success) {
            Alert.alert(
              'Success',
              msjSucces,
              [
                { text: 'OK', onPress: () => console.log(msjSucces) },
              ],
              { cancelable: false },
            );
          } else {
            Alert.alert(
              'Atención',
              responseJson.errorMessage,
              [
                { text: 'OK', onPress: () => console.log(mjsError) },
              ],
              { cancelable: false },
            );
          }
        })
        .catch((error) => {
          this.setState({
            spinnerVisible: false,
          });
          Alert.alert(
            'Error',
            mjsError,
            [
              { text: 'OK', onPress: () => console.log(mjsError) },
            ],
            { cancelable: false },
          );
        });
    });
  }

  sendQuieroJugar() {
    const { user, navigation } = this.props;
    this.setState({
      spinnerVisible: true,
    }, () => {
      fetch(`${API}/match/play`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.profile.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: navigation.state.params.match }),
      })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          spinnerVisible: false,
        });

        if (responseJson.success) {
          Alert.alert(
            'Atención',
            'Se envio la solicitud.',
            [
              { text: 'OK', onPress: () => navigation.navigate('Play') },
            ],
            { cancelable: false },
          );
        } else {
          Alert.alert(
            'Error',
            'Hubo un error, intente más tarde.',
            [
              { text: 'OK', onPress: () => console.log('Error') },
            ],
            { cancelable: false },
          );
        }
      })
      .catch((error) => {
        this.setState({
          spinnerVisible: false,
        });
        Alert.alert(
          'Error',
          'Hubo un error, intente más tarde.',
          [
            { text: 'OK', onPress: () => console.log(error) },
          ],
          { cancelable: false },
        );
      });
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  openModalAvailable() {
    this.setState({ modalMaps: true });
  }

  closeModalAvailable() {
    this.setState({ modalMaps: false });
  }

  infoMatch(match) {
    if (match) {
      const type = this.capitalizeFirstLetter(match.type);
      const sexo = this.capitalizeFirstLetter(match.sexo);
      return (
        <View>
          <View style={styles.aboutContainer}>
            <Text style={[Styles.title, { marginBottom: 0, color: '#393e44', fontSize: 22 }]}>{match.about}</Text>
          </View>
          <View style={styles.containerInformationBasic}>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>FECHA</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: Metrics.width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {match.date}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>HORA</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: Metrics.width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {match.hour}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>LUGAR</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: Metrics.width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {match.address}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>NOMBRE DEL CLUB</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: Metrics.width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {match.club_name}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>NIVEL DEL JUEGO DESDE</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: Metrics.width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {match.game_level_from}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>NIVEL DEL JUEGO HASTA</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: (Metrics.width - 10) / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {match.game_level_to}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>TIPO DE PARTIDO</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: (Metrics.width - 10) / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {type}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>EDAD DESDE</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: Metrics.width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {match.years_from}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>EDAD HASTA</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: Metrics.width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {match.years_to}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
              >
                <Text style={[Styles.inputText, { color: 'white' }]}>SEXO</Text>
                <Text
                  style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: Metrics.width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
                >
                  {sexo}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return null;
  }

  infoPlayers(match) {
    if (match && match.matchPlayer && match.matchPlayer.length > 0) {
      const PlayersConfirmed = match.matchPlayer.filter(mp => mp.state === stateInvite.confirmed);
      const PlayersOthers = match.matchPlayer.filter(mp => mp.state !== stateInvite.confirmed);

      return (
        <View>
          <View>
            {this.renderPlayersConfirmed(PlayersConfirmed.reverse())}
          </View>
          <View>
            {this.renderPlayersInvite(PlayersOthers.reverse())}
          </View>
        </View>
      );
    }
    return null;
  }

  renderPlayersConfirmed(players) {
    if (players.length > 0) {
      return (
        <View style={{ paddingHorizontal: 20 }}>
          <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1 }]}>
            <View>
              <Text style={{ color: '#393e44', fontSize: 15 }}>MIRÁ LOS JUGADORES</Text>
            </View>
            <View>
              <Text style={{ color: Colors.primary, fontSize: 17 }}>YA ANOTADOS</Text>
            </View>
          </View>
          <View style={[Styles.flexRow, { justifyContent: 'flex-start', marginTop: 10 }]}>
            {players.map((p, k) => {
              return this.renderPlayer(p, k, true)
            })}
          </View>
        </View>
      );
    }

    return null;
  }

  renderPlayersInvite(players) {
    if (players.length > 0) {
      return (
        <View style={{ marginTop: 20, paddingHorizontal: 20, backgroundColor: '#f5f5f5', paddingVertical: 10 }}>
          <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1 }]}>
            <Text style={{ color: '#393e44', fontSize: 15 }}>MIRÁ LOS JUGADORES</Text>
            <Text style={{ color: Colors.primary, fontSize: 17 }}>QUE AUN NO CONTESTARON</Text>
          </View>
          <View style={[Styles.flexRow, { justifyContent: 'flex-start', marginTop: 10 }]}>
            {players.map((p, k) => {
              return this.renderPlayer(p, k, false);
            })}
          </View>
        </View>
      );
    }

    return null;
  }

  renderPlayer(player, key, feedback) {
    const { match } = this.state;
    console.log(match);
    return (
      <View key={key} style={[Styles.flexColumn, { width: Metrics.width / 3, borderWidth: 1, borderColor: '#e1e5e6', padding: 8, marginRight: 5 }]}>
        <View>
          <TouchableItem
            onPress={() => this.props.navigation.navigate('ViewPlayer', { user: player.user.id, backName: 'MatchDetail', backParams: { match: match.id } })}
          > 
            <View>
              {commonFunc.renderImageProfile(player.user.image, 80)}
            </View>
          </TouchableItem>
        </View>
        <View>
          <TouchableItem
            onPress={() => this.props.navigation.navigate('ViewPlayer', { user: player.user.id, backName: 'MatchDetail', backParams: { match: match.id } })}
          >
            <View>
              <Text style={{ color: '#393e44' }}>{player.user.first_name}</Text>
              <Text style={{ color: Colors.primary }}>{player.user.last_name}</Text>
            </View>
          </TouchableItem>
        </View>
        {(!match.futureMatch && feedback && match.id_user !== this.props.user.profile.id) &&
          (
            <View style={{ marginTop: 5 }}>
              <TouchableItem
                accessibilityComponentType="button"
                accessibilityTraits="button"
                delayPressIn={0}
                onPress={() => this.props.navigation.navigate('Feedback', { match: match.id, player: player.user.id })}
                pressColor={Colors.primary}
                style={{ backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 3, paddingTop: 3, }}
              >
                <View>
                  <Text style={[Styles.inputText, { color: 'white', textAlign: 'center', fontSize: 11 }]}>FEEDBACK</Text>
                </View>
              </TouchableItem>
            </View>
          )
        }
        {
          //Mi partido, acepta/cancelo la SOLICITUDES
        }
        {(match.futureMatch && match.id_user === this.props.user.profile.id && !feedback && player.state === 'pendingRequest') &&
          (
            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
              <TouchableItem
                style={{ width: Metrics.buttonWidth / 2 }}
                accessibilityComponentType="button"
                accessibilityTraits="button"
                delayPressIn={0}
                onPress={() => this.acceptUser(match.id, player.user.id)}
                pressColor={Colors.primary}
                style={{ backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 3, paddingTop: 3, }}
              >
                <View>
                  <Text style={[Styles.inputText, { color: 'white', textAlign: 'center', fontSize: 11 }]}>ACEPTAR</Text>
                </View>
              </TouchableItem>

              <TouchableItem
                style={{ width: Metrics.buttonWidth / 2 }}
                accessibilityComponentType="button"
                accessibilityTraits="button"
                delayPressIn={0}
                onPress={() => this.refuseUser(match.id, player.user.id)}
                pressColor={Colors.primary}
                style={{ backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 3, paddingTop: 3, }}
              >
                <View>
                  <Text style={[Styles.inputText, { color: 'white', textAlign: 'center', fontSize: 11 }]}>RECHAZAR</Text>
                </View>
              </TouchableItem>
            </View>
          )
        }
        {
          //No es mi partido, acepta/cancelo la SOLICITUDES
        }
        {(match.futureMatch && player.user.id === this.props.user.profile.id && player.state === 'pendingInvitation') &&
          (<View key={`btn-player-${player.user.id}`} style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            <TouchableItem
              key={`btn1-player-${player.user.id}`}
              accessibilityComponentType="button"
              accessibilityTraits="button"
              delayPressIn={0}
              onPress={() => this.acceptMatch(match.id, player.user.id)}
              pressColor={Colors.primary}
              style={{ backgroundColor: Colors.primary, borderRadius: 5, paddingHorizontal: 3, paddingTop: 3, marginTop: 5 }}
            >
              <View>
                <Text style={[Styles.inputText, { color: 'white', textAlign: 'center', fontSize: 11 }]}> ACEPTAR</Text>
              </View>
            </TouchableItem>

            <TouchableItem
              key={`btn2-player-${player.user.id}`}
              accessibilityComponentType="button"
              accessibilityTraits="button"
              delayPressIn={0}
              onPress={() => this.refuseMatch(match.id, player.user.id)}
              pressColor={Colors.primary}
              style={{ backgroundColor: Colors.primary, borderRadius: 5, paddingHorizontal: 3, paddingTop: 3, marginTop: 5 }}
            >
              <View>
                <Text style={[Styles.inputText, { color: 'white', textAlign: 'center', fontSize: 11 }]}>RECHAZAR</Text>
              </View>
            </TouchableItem>
          </View>)
        }
        {
          //No es mi partido, estado de las solicitudes
        }
        {(match.futureMatch && match.id_user === this.props.user.profile.id && player.state === 'pendingInvitation') &&
          (
            <View key={`btn-player-${player.user.id}`}>
              <Text style={[Styles.inputText, { color: '#393e44', textAlign: 'center', fontSize: 11 }]}>SOLICITUD ENVIADA</Text>
            </View>
          )
        }


        {(match.futureMatch && (match.id_user === this.props.user.profile.id || player.user.id === this.props.user.profile.id) && player.state === 'rejected') &&
          (<View key={`btn-player-${player.user.id}`}>
            <Text style={[Styles.inputText, { color: '#393e44', textAlign: 'center', fontSize: 10 }]}>SOLICITUD RECHAZADA</Text>
          </View>)
        }
        {(match.futureMatch && (match.id_user === this.props.user.profile.id || player.user.id === this.props.user.profile.id) && player.state === 'invitationDeclined') &&
          (<View key={`btn-player-${player.user.id}`}>
            <Text style={[Styles.inputText, { color: '#393e44', textAlign: 'center', fontSize: 10 }]}>INVITACIÓN RECHAZADA</Text>
          </View>)
        }
      </View>
    );
  }

  renderSuggestedPlayers(match) {
    if (match && match.futureMatch && match.id_user === this.props.user.profile.id) {
      return (
        <TouchableItem
          accessibilityComponentType="button"
          accessibilityTraits="button"
          delayPressIn={0}
          style={[Styles.btnSave, { marginBottom: 20 }]}
          onPress={() => this.props.navigation.navigate('SuggestedPlayers', { match: match.id, backName: 'MatchDetail', backParams: { match: match.id } })}
          pressColor={Colors.primary}
        >
          <View>
            <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]} >VER JUGADORES SUGERIDOS</Text>
          </View>
        </TouchableItem>
      );
    }
    return null;
  }

  renderQuieroJugar(match) {
    if(!match) return null;
    const user = match.matchPlayer.find(p => p.id_user === this.props.user.profile.id);
    if (!user) {
      return (
        <TouchableItem
          accessibilityComponentType="button"
          accessibilityTraits="button"
          delayPressIn={0}
          style={[Styles.btnSave, { marginBottom: 20 }]}
          onPress={() => this.sendQuieroJugar()}
          pressColor={Colors.primary}
        >
          <View>
            <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]} >QUIERO JUGAR</Text>
          </View>
        </TouchableItem>
      );
    }
  }

  render() {
    const { navigation } = this.props;
    const { match } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="keyboard-arrow-left"
          onPress={() => navigation.navigate('MatchHistory')}
          title="Detalle del Partido"
        />
        <ScrollView style={{ paddingBottom: 20 }}>
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View>
            <Text style={Styles.title}>Detalle del Partido</Text>
          </View>
          <View>
            <View>
              {this.infoMatch(match)}
            </View>

            <View style={{ paddingTop: 20 }}>
              {this.infoPlayers(match)}
            </View>

            {/*<View style={{ marginTop: 10 }}>
              {this.renderSuggestedPlayers(match)}
            </View>

            <View style={{ marginTop: 10 }}>
              {this.renderQuieroJugar(match)}
            </View>*/}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  aboutContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  containerInformationBasic: {
    backgroundColor: '#393e44',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  textImage: {
    color: Colors.primary,
    fontSize: 18,
    paddingLeft: 10,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  containerPhoto: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});


export default MatchDetailScreen;
