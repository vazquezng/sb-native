import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Platform,
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

const fontRegular = Platform.OS === 'ios' ? 'Cookie' : 'CookieRegular';

const mapStateToProps = state => ({
  user: state.user,
});
@connect(mapStateToProps)
class PlayMatchScreen extends Component {
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

  infoMatch(match) {
    if (match) {
      const user = match.matchPlayer.find(p => p.id_user === match.id_user);
      const typeImage = match.type === 'singles' ? require('../../assets/play/singles-btn.png') : require('../../assets/play/doubles-btn.png');
      return (
        <View>
          <View>
            <Text style={Styles.title}>{match.about}</Text>
          </View>
          <View style={[Styles.flexColumn, { marginBottom: 10 }]}>
            {this.renderImage(user)}
            <Text style={{ width: Metrics.buttonWidth, textAlign: 'center', color: '#000000', fontSize: 18, borderColor: Colors.primary, borderBottomWidth: 1, paddingBottom: 2 }}>{user.user.first_name} {user.user.last_name}</Text>
            <Text style={{ color: Colors.primary, fontFamily: fontRegular, fontSize: 16 }}>{match.date} - {match.hour}</Text>
            <Text style={{ width: Metrics.buttonWidth, textAlign: 'center', color: '#000000', fontSize: 12, borderColor: Colors.primary, borderBottomWidth: 1, paddingBottom: 2, marginTop: 10 }}>{match.club_name}</Text>
            <Text numberOfLines={1}>{match.address}</Text>
          </View>
          <View style={[Styles.flexColumn, { marginBottom: 10 }]}>
            <Image
              source={typeImage} style={{
                marginTop: 10,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={Styles.flexRow}>
              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  multiline
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 20 ) / 2 }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={match.game_level_from}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Nivel del juego desde</Text>
              </View>

              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  multiline
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 20 ) / 2  }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={match.game_level_to}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Nivel del juego hasta</Text>
              </View>
            </View>
            <View style={Styles.flexRow}>
              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  multiline
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 20 ) / 2  }]}
                  underlineColorAndroid={'transparent'}
                  placeholderTextColor="lightgrey"
                  value={match.years_from}
                  editable={false}
                />
                <Text style={[Styles.inputText]}>Edad desde</Text>
              </View>
              <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
                <TextInput
                  multiline
                  style={[Styles.inputDisabled, { width: (Metrics.buttonWidth - 20 ) / 2  }]}
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
                multiline
                style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={match.sexo}
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

  renderImage(user) {
    const imageURI = user.user.image ? user.user.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: 100,
          height: 100,
          borderTopLeftRadius: 80,
          borderTopRightRadius: 80,
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80,
          marginTop: 10,
          marginBottom: 10,
        }}
      />
    );
  }

  infoPlayers(match) {
    if (match && match.matchPlayer && match.matchPlayer.length > 0) {
      return match.matchPlayer.map((p, key) => {
        if (p.state !== 'confirmed') return null;
        
        const imageURI = p.user.image ? p.user.image : 'http://web.slambow.com/img/profile/profile-blank.png';
        return (
          <View key={key} style={[Styles.flexRow, { justifyContent: 'flex-start', alignItems: 'center', marginRight: 10 }]}>
            <View>
              <View style={[Styles.flexColumn, { justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } ]}>
                <TouchableItem
                  onPress={() => this.props.navigation.navigate('ViewPlayer', { user: p.user.id, backName: 'PlayMatch', backParams: { match: this.props.navigation.state.params.match } })}
                >
                  <Image
                    source={{ uri: imageURI }} style={{ width: 100,
                      height: 100,
                      borderTopLeftRadius: 80,
                      borderTopRightRadius: 80,
                      borderBottomLeftRadius: 80,
                      borderBottomRightRadius: 80,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                </TouchableItem>
                <Text style={{ textAlign: 'center', color: '#000000', fontSize: 18, borderColor: Colors.primary, borderBottomWidth: 1, paddingBottom: 2 }}>{p.user.first_name}</Text>
                <Text style={{ textAlign: 'center', color: Colors.primary, fontSize: 18, paddingBottom: 2 }}>{p.user.last_name}</Text>
              </View>
            </View>
          </View>
        );
      });
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
          onPress={() => navigation.navigate('Play')}
          title="Detalle del Partido"
        />
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View>
            {this.infoMatch(match)}

            <View style={Styles.flexColumn}>
              <Text style={Styles.subTitle}>MIRÁ LOS JUGADORES</Text>
              <Text style={[Styles.subTitle, { color: Colors.primary }]}>YA ANOTADOS</Text>
            </View>
            <ScrollView horizontal={true}>
              <View style={[Styles.flexRow, { justifyContent: 'flex-start' }]}>
                {this.infoPlayers(match)}
              </View>
            </ScrollView>
            <View>
              {this.renderQuieroJugar(match)}
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


export default PlayMatchScreen;
