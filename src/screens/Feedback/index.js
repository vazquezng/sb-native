import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Slider,
  Alert,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';
import PickerSB from '@components/Picker';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';
import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const pickerSexo = [{ label: 'Masculino', value: 'male' }, { label: 'Femenino', value: 'female' }, { label: 'mixto', value: 'mixto' }];

const mapStateToProps = state => ({
  user: state.user,
});

@connect(mapStateToProps)
class FeedbackScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Feedback',
    headerLeft: (
      <HeaderButton
        icon="keyboard-arrow-left"
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
      complete: false,
      match: null,
      user: null,
      feedback: {
        has_attended: '1',
        comment: '',
        reason: '',
        game_level: '2.5',
        punctuality: '7',
        respect: '7',
      },
    };
  }

  componentWillMount() {
    const { user, navigation } = this.props;
    fetch(`${API}/feedback/detail/${navigation.state.params.match}/${navigation.state.params.player}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      },
    })
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({
        complete: responseJson.complete,
        match: responseJson.match,
        user: responseJson.user,
      });
    });
  }

  renderUser() {
    const { user } = this.state;
    if (user) {
      const imageURI = user && user ? user.image : 'http://web.slambow.com/img/profile/profile-blank.png';
      return (
        <View style={[Styles.flexColumn, { justifyContent: 'center', alignItems: 'center', marginBottom: 10 }]}>
          <Image
            source={{ uri: imageURI }} style={{ width: 160,
              height: 160,
              borderRadius: 80,
              borderTopLeftRadius: 100,
              borderTopRightRadius: 100,
              borderBottomLeftRadius: 100,
              borderBottomRightRadius: 100 }}
          />
          <Text>{user.name}</Text>
          <Text style={{ color: '#000000' }}>JUGADOR</Text>
        </View>
      );
    }
    return null;
  }
  infoMatch() {
    const { match } = this.state;
    //let valueSexo = pickerSexo.find(ps => ps.value === match.sexo);
    if (match) {
      return (
        <View>
          <View style={Styles.flexRow}>
            <Text style={[Styles.inputText, { color: Colors.primary }]}>DATOS DEL PARTIDO</Text>
          </View>

          <View>
            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.date}</Text>
              <Text style={[Styles.inputText]}>Fecha</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.hour}</Text>
              <Text style={[Styles.inputText]}>Hora</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.address}</Text>
              <Text style={[Styles.inputText]}>Lugar</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.game_level_from}</Text>
              <Text style={[Styles.inputText]}>Nivel del juego desde</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.type}</Text>
              <Text style={[Styles.inputText]}>Tipo de partido</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.years_from}</Text>
              <Text style={[Styles.inputText]}>Edad</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.sexo}</Text>
              <Text style={[Styles.inputText]}>Sexo</Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
  }
  renderInfoUser() {
    const { user } = this.state;
    if (user) {
      const game_level = user.game_level.toString();
      return (
        <View>
          <View style={Styles.flexRow}>
            <Text style={[Styles.inputText, { color: Colors.primary }]}>JUGADOR</Text>
          </View>
          <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 } ]}>
            <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{game_level}</Text>
            <Text style={[Styles.inputText]}>Nivel declarado del jugador</Text>
          </View>
        </View>
      );
    }
    return null;
  }

  renderHasAttended() {
    const { feedback } = this.state;
    if (feedback.has_attended === '1') {
      return (
        <View>
          <View style={[ styles.flexColumn, { marginTop: 10 }]}>
            <Text>{feedback.game_level}</Text>
            <Slider
              style={{ width: Metrics.buttonWidth, height: 33 }}
              minimumValue={2.5}
              maximumValue={7}
              maximumTrackTintColor={Colors.primary}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={Colors.primary}
              step={0.5}
              value={parseInt(feedback.game_level)}
              onValueChange={game_level => this.setState({ feedback: Object.assign(feedback, { game_level }) })} />
            <Text style={Styles.inputText}>NIVEL DE JUEGO</Text>
          </View>

          <View style={[ styles.flexColumn, { marginTop: 10 }]}>
            <Text>{feedback.punctuality}</Text>
            <Slider
              style={{ width: Metrics.buttonWidth, height: 33 }}
              minimumValue={1}
              maximumValue={10}
              maximumTrackTintColor={Colors.primary}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={Colors.primary}
              step={1}
              value={parseInt(feedback.punctuality)}
              onValueChange={punctuality => this.setState({ feedback: Object.assign(feedback, { punctuality }) })} />
            <Text style={Styles.inputText}>PUNTUALIDAD</Text>
          </View>

          <View style={[ styles.flexColumn, { marginTop: 10 }]}>
            <Text>{feedback.respect}</Text>
            <Slider
              style={{ width: Metrics.buttonWidth, height: 33 }}
              minimumValue={1}
              maximumValue={10}
              maximumTrackTintColor={Colors.primary}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={Colors.primary}
              step={1}
              value={parseInt(feedback.respect)}
              onValueChange={respect => this.setState({ feedback: Object.assign(feedback, { respect }) })} />
            <Text style={Styles.inputText}>RESPETO</Text>
          </View>
        </View>
      );
    }
    return null;
  }
  renderNotHasAttended() {
    const { feedback } = this.state;
    if (feedback.has_attended === '0') {
      return (
        <View>
          <View style={[styles.flexColumn]}>
            <Text style={Styles.inputText}>¿Cuál fue el motivo?</Text>
            <TextInput
              style={[Styles.input, { width: Metrics.buttonWidth, borderWidth: StyleSheet.hairlineWidth, height: 100, textAlignVertical: 'top' }]}
              underlineColorAndroid={'transparent'}
              placeholderTextColor="lightgrey"
              multiline
              value={feedback.reason}
              onChangeText={reason => this.setState({ profile: Object.assign(feedback, { reason }) })}
              ref={(r) => { this._reason = r; }}
            />
          </View>
        </View>
      );
    }
    return null;
  }

  renderFeedback() {
    const { feedback } = this.state;
    const has_attended = parseInt(feedback.has_attended) === 1 ? 'SI' : 'NO';
    return (
      <View>
        <View style={Styles.flexColumn}>
          <Text style={[Styles.inputText, { color: Colors.primary }]}>
            INGRESA A TU CRITERIO EL NIVEL DEL JUGADOR Y COMPLETA EL RESTO DE LOS CAMPOS
          </Text>
          <View style={[styles.flexColumn]}>
            <PickerSB
              containerStyle={[Styles.pickerContainer, { width: Metrics.buttonWidth  }]}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16 }}
              selectedValue={has_attended}
              list={[{ label: 'SI', value: '1' }, { label: 'NO', value: '0' }]}
              onSelectValue={option => this.setState({ profile: Object.assign(feedback, { has_attended: option.value }) })}
            />
            <Text style={Styles.inputText}>ASISTIÓ AL PARTIDO</Text>
          </View>
          {this.renderHasAttended()}
          {this.renderNotHasAttended()}
          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <Text style={Styles.inputText}>Dejanos tu comentario...</Text>
              <TextInput
                style={[Styles.input, { width: Metrics.buttonWidth, borderWidth: StyleSheet.hairlineWidth, height: 100, textAlignVertical: 'top' }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                multiline
                value={feedback.comment}
                onChangeText={comment => this.setState({ feedback: Object.assign(feedback, { comment }) })}
                ref={(r) => { this._comment = r; }}
                returnKeyType={'next'}
                onBlur={() => console.log('blur')}
                enablesReturnKeyAutomatically={true}
                onKeyPress={(event) => console.log(event)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  saveFeedback() {
    const { feedback, match, user } = this.state;

    if (feedback.comment === '' || (feedback.has_attended === '0' && feedback.reason === '') ) {
      this.completeForm();

      return false;
    }

    feedback.id_user_to = user.id; // jugado
    feedback.id_match = match.id;
    console.log(feedback);
    this.setState({ spinnerVisible: true });
    fetch(`${API}/feedback/save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.user.profile.token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(feedback)
    })
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({ spinnerVisible: false });
      Alert.alert(
        'Atención',
        'Se guardo correctamente.',
        [
          { text: 'OK', onPress: () => console.log('Complete los campos.') },
        ],
        { cancelable: false },
      );
    })
    .catch(() => {
      this.setState({ spinnerVisible: false });
      Alert.alert(
        'Atención',
        'Hubo un error, intente más tarde.',
        [
          { text: 'OK', onPress: () => console.log('Complete los campos.') },
        ],
        { cancelable: false },
      );
    });

    return true;
  }

  completeForm() {
    Alert.alert(
      'Error',
      'Complete los campos.',
      [
        { text: 'OK', onPress: () => console.log('Complete los campos.') },
      ],
      { cancelable: false },
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="keyboard-arrow-left"
          onPress={() => navigation.navigate('MatchDetail', { match: navigation.state.params.match })}
          title="Feedback"
        />
        <KeyboardAwareScrollView
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps={'never'}
          style={Styles.containerPrimary}
        >
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={styles.centerContent}>
            <Text style={Styles.title}>Feedback</Text>
          </View>
          <View style={Styles.flexColumn}>
            {this.renderUser()}
            {this.infoMatch()}
            {this.renderInfoUser()}
            {this.renderFeedback()}
          </View>
          {!this.state.complete &&
            <View style={[styles.flexRow, { marginTop: 20, marginBottom: 20 }]}>
              <TouchableItem
                pointerEvents="box-only"
                accessibilityComponentType="button"
                accessibilityTraits="button"
                testID="profile-available"
                delayPressIn={0}
                style={Styles.btnSave}
                onPress={this.saveFeedback.bind(this)}
                pressColor={Colors.primary}
              >
                <View pointerEvents="box-only">
                  <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center'}]}>GUARDAR</Text>
                </View>
              </TouchableItem>
            </View>
          }
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default FeedbackScreen;
