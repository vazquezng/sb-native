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
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';
import API from '@utils/api';

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
    };
  }

  componentWillMount() {
    const { user, navigation } = this.props;
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
            'Error',
            mjsError,
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

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  infoMatch(match) {
    if (match) {
      const type = this.capitalizeFirstLetter(match.type);
      const sexo = this.capitalizeFirstLetter(match.sexo);
      return (
        <View>
          <View>
            <View style={Styles.flexRow}>
              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 40) / 2 }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={match.date}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Fecha</Text>
              </View>

              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 40) / 2 }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={match.hour}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Hora</Text>
              </View>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <TextInput
                style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={match.address}
                editable={false}
              />
              <Text style={[Styles.inputText]}>Lugar</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <TextInput
                style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={match.club_name}
                editable={false}
              />
              <Text style={[Styles.inputText]}>Nombre del Club</Text>
            </View>

            <View style={Styles.flexRow}>
              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 40) / 2 }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={match.game_level_from}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Nivel del juego desde</Text>
              </View>

              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 40) / 2 }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={match.game_level_to}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Nivel del juego hasta</Text>
              </View>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <TextInput
                style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={type}
                editable={false}
              />
              <Text style={[Styles.inputText]}>Tipo de partido</Text>
            </View>

            <View style={Styles.flexRow}>
              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 40) / 2 }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={match.years_from}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Edad desde</Text>
              </View>
              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 40) / 2 }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={match.years_to}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Edad hasta</Text>
              </View>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <TextInput
                style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={sexo}
                editable={false}
              />
              <Text style={[Styles.inputText]}>Sexo</Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
  }

  infoPlayers(match) {
    if (match && match.matchPlayer && match.matchPlayer.length > 0) {
      return match.matchPlayer.map((p, key) => {
        return (
          <View key={key} style={[Styles.flexRow, { justifyContent: 'flex-start', alignItems: 'center' }]}>
            <View>
              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  style={[Styles.inputDisabled, { width: Metrics.buttonWidth / 2 }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={p.user.first_name}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Jugador</Text>
              </View>
            </View>
            <View>
              {this.renderButtonUserOne(match, p)}
              {this.renderButtonUserTwo(match, p)}
            </View>
          </View>
        );
      });
    }
    return null;
  }

  renderButtonUserOne(match, player) {
    let blockOne = null;
    if (this.state.isPlayer && player.user.id !== this.props.user.profile.id) {
      blockOne = this.conditionBlockOne(match, player);
    }

    return blockOne;
  }
  renderButtonUserTwo(match, player) {
    let blockTwo = null;
    if (this.state.isPlayer && match.futureMatch) {
      blockTwo = this.conditionBlockTwo(match, player);
    }

    return blockTwo;
  }


  conditionBlockOne(match, player) {
    if (!match.futureMatch && !player.user.hasFeedback) {
      return (
        <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start'}]}>
          <TouchableItem
            style={{ width: Metrics.buttonWidth / 2 }}
            accessibilityComponentType="button"
            accessibilityTraits="button"
            delayPressIn={0}
            onPress={() => this.props.navigation.navigate('Feedback', { match: match.id, player: player.user.id })}
            pressColor={Colors.primary}
          >
            <View>
              <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center'}]}>DANOS TU FEEDBACK</Text>
            </View>
          </TouchableItem>
        </View>
      );
    } else if (match.futureMatch && player.state === 'pendingRequest') {
      return (
        <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start'}]}>
          <TouchableItem
            style={{ width: Metrics.buttonWidth / 2 }}
            accessibilityComponentType="button"
            accessibilityTraits="button"
            delayPressIn={0}
            onPress={() => this.acceptUser(match.id, player.user.id)}
            pressColor={Colors.primary}
          >
            <View>
              <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>ACEPTAR</Text>
            </View>
          </TouchableItem>

          <TouchableItem
            style={{ width: Metrics.buttonWidth / 2 }}
            accessibilityComponentType="button"
            accessibilityTraits="button"
            delayPressIn={0}
            onPress={() => this.refuseUser(match.id, player.user.id)}
            pressColor={Colors.primary}
          >
            <View>
              <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>RECHAZAR</Text>
            </View>
          </TouchableItem>
        </View>
      );
    } else if (match.futureMatch && player.state === 'pendingInvitation') {
      return (
        <View>
          <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>INVITACIÓN ENVIADA</Text>
        </View>
      );
    }

    return null;
  }

  conditionBlockTwo(match, player) {
    if (player.user.id === this.props.user.profile.id) {
      if (player.state === 'pendingInvitation' && match.id_user !== this.props.user.profile.id) {
        return (
          <View key={`btn-player-${player.user.id}`} style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            <TouchableItem
              key={`btn1-player-${player.user.id}`}
              style={{ width: Metrics.buttonWidth / 2 }}
              accessibilityComponentType="button"
              accessibilityTraits="button"
              delayPressIn={0}
              onPress={() => this.acceptMatch(match.id, player.user.id)}
              pressColor={Colors.primary}
            >
              <View>
                <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}> ACEPTAR</Text>
              </View>
            </TouchableItem>

            <TouchableItem
              key={`btn2-player-${player.user.id}`}
              style={{ width: Metrics.buttonWidth / 2 }}
              accessibilityComponentType="button"
              accessibilityTraits="button"
              delayPressIn={0}
              onPress={() => this.refuseMatch(match.id, player.user.id)}
              pressColor={Colors.primary}
            >
              <View>
                <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>RECHAZAR</Text>
              </View>
            </TouchableItem>
          </View>
        );
      } else if (player.state === 'pendingRequest') {
        return (
          <View key={`btn-player-${player.user.id}`}>
            <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>
              SOLICITUD PENDIENTE
            </Text>
          </View>
        );
      }
    } else if (player.state === 'confirmed') {
      return (
        <View key={`btn-player-${player.user.id}`}>
          <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>CONFIRMADO</Text>
        </View>
      );
    } else if (player.state === 'rejected') {
      return (
        <View key={`btn-player-${player.user.id}`}>
          <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>SOLICITUD RECHAZADA</Text>
        </View>
      );
    } else if (player.state === 'invitationDeclined') {
      return (
        <View key={`btn-player-${player.user.id}`}>
          <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>INVITACIÓN RECHAZADA</Text>
        </View>
      );
    }

    return null;
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
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          <Spinner visible={this.state.spinnerVisible} />
          <View>
            <Text style={Styles.title}>Detalle del Partido</Text>
          </View>

          <View>
            {this.infoMatch(match)}

            <View style={Styles.flexColumn}>
              {this.infoPlayers(match)}
            </View>

            <View style={Styles.flexRow}>
              {this.renderSuggestedPlayers(match)}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
