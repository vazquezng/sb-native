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
  ImageBackground,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';
import PickerSB from '@components/Picker';
import FooterButtons from '@components/Footer/Buttons';

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
        tintColor="white"
        title="Vuelos Baratos"
        truncatedTitle="vuelos"
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
        game_level: 'CORRECTO',
        punctuality: 'PUNTUAL',
        respect: 'BIEN',
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

  saveFeedback() {
    const { feedback, match, user } = this.state;

    if (feedback.comment === '' || (feedback.has_attended === '0' && feedback.reason === '')) {
      this.completeForm();

      return false;
    }

    feedback.id_user_to = user.id; // jugado
    feedback.id_match = match.id;
    this.setState({ spinnerVisible: true });
    fetch(`${API}/feedback/save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.user.profile.token}`,
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(feedback),
    })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState(
          { spinnerVisible: false },
          () => {
            Alert.alert(
              'Atención',
              'Se guardo correctamente.',
              [
                { text: 'OK', onPress: () => console.log('Complete los campos.') },
              ],
              { cancelable: false },
            );
          },
        );
      })
      .catch(() => {
        this.setState(
          { spinnerVisible: false },
          () => {
            Alert.alert(
              'Atención',
              'Hubo un error, intente más tarde.',
              [
                { text: 'OK', onPress: () => console.log('Complete los campos.') },
              ],
              { cancelable: false },
            );
          },
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

  renderUser() {
    const { user } = this.state;
    if (user) {
      const imageURI = user && user ? user.image : 'http://web.slambow.com/img/profile/profile-blank.png';
      return (
        <View style={[Styles.flexColumn, { justifyContent: 'center', alignItems: 'center', marginBottom: 10 }]}>
          <Image
            source={{ uri: imageURI }}
            style={{
 width: 160,
              height: 160,
              borderRadius: 80,
              borderTopLeftRadius: 100,
              borderTopRightRadius: 100,
              borderBottomLeftRadius: 100,
              borderBottomRightRadius: 100,
}}
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
    // let valueSexo = pickerSexo.find(ps => ps.value === match.sexo);
    if (match) {
      return (
        <View>
          <View style={Styles.flexRow}>
            <Text style={[Styles.inputText, { color: Colors.primary }]}>DATOS DEL PARTIDO</Text>
          </View>

          <View>
            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 }]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.date}</Text>
              <Text style={[Styles.inputText]}>Fecha</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 }]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.hour}</Text>
              <Text style={[Styles.inputText]}>Hora</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 }]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.address}</Text>
              <Text style={[Styles.inputText]}>Lugar</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 }]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.game_level_from}</Text>
              <Text style={[Styles.inputText]}>Nivel del juego desde</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 }]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.type}</Text>
              <Text style={[Styles.inputText]}>Tipo de partido</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 }]}>
              <Text style={[Styles.inputDisabled, { width: Metrics.buttonWidth }]}>{match.years_from}</Text>
              <Text style={[Styles.inputText]}>Edad</Text>
            </View>

            <View style={[Styles.flexColumn, { justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 10 }]}>
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
    const me = this.props.user;
    if (user) {
      return (
        <View style={[Styles.containerPrimary, { backgroundColor: '#414143', width: Metrics.screenWidth, paddingTop: 20 }]}>
          <ImageBackground
            source={require('../../assets/cancha.png')}
            style={{
 flex: 1, width: null, height: null, padding: 30,
}}
            resizeMode="cover"
          >
            <View style={[Styles.flexRow]}>
              <View style={Styles.flexColumn}>
                {commonFunc.renderImageProfile(me.profile.image, 80)}
                <Text style={{ color: 'white', marginTop: 20 }}>{me.profile.name.toUpperCase()}</Text>
              </View>
              <View style={Styles.flexColumn}>
                {commonFunc.renderImageProfile(user.image, 80)}
                <Text style={{ color: 'white', marginTop: 20 }}>{user.name.toUpperCase()}</Text>
              </View>
            </View>
          </ImageBackground>
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
          <View style={[styles.flexColumn, { marginTop: 10 }]}>
            <PickerSB
              containerStyle={{ width: Metrics.buttonWidth, height: 33 }}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16 }}
              selectedValue={feedback.game_level}
              list={[{ label: 'CORRECTO', value: 'CORRECTO' }, { label: 'INCORRECTO', value: 'INCORRECTO' }]}
              onSelectValue={option => this.setState({ profile: Object.assign(feedback, { game_level: option.value }) })}
            />
            <Text style={[Styles.inputText, { color: Colors.primary }]}>NIVEL DECLARADO</Text>
          </View>

          <View style={[styles.flexColumn, { marginTop: 10 }]}>
            <PickerSB
              containerStyle={{ width: Metrics.buttonWidth, height: 33 }}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16 }}
              selectedValue={feedback.punctuality}
              list={[{ label: 'PUNTAL', value: 'PUNTAL' }, { label: 'IMPUNTUAL', value: 'IMPUNTUAL' }]}
              onSelectValue={option => this.setState({ profile: Object.assign(feedback, { punctuality: option.value }) })}
            />
            {/* <Slider
              style={{ width: Metrics.buttonWidth, height: 33 }}
              minimumValue={1}
              maximumValue={10}
              maximumTrackTintColor={Colors.primary}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={Colors.primary}
              step={1}
              value={parseInt(feedback.punctuality)}
              onValueChange={punctuality => this.setState({ feedback: Object.assign(feedback, { punctuality }) })}
            /> */}
            <Text style={[Styles.inputText, { color: Colors.primary }]}>PUNTUALIDAD</Text>
          </View>

          <View style={[styles.flexColumn, { marginTop: 10 }]}>
            <PickerSB
              containerStyle={{ width: Metrics.buttonWidth, height: 33 }}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16 }}
              selectedValue={feedback.respect}
              list={[{ label: 'BIEN', value: 'BIEN' }, { label: 'MAL', value: 'MAL' }]}
              onSelectValue={option => this.setState({ profile: Object.assign(feedback, { respect: option.value }) })}
            />
            {/* <Slider
              style={{ width: Metrics.buttonWidth, height: 33 }}
              minimumValue={1}
              maximumValue={10}
              maximumTrackTintColor={Colors.primary}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={Colors.primary}
              step={1}
              value={parseInt(feedback.respect)}
              onValueChange={respect => this.setState({ feedback: Object.assign(feedback, { respect }) })}
            /> */}
            <Text style={[Styles.inputText, { color: Colors.primary }]}>RESPETO</Text>
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
            <Text style={[Styles.inputText, { color: Colors.primary }]}>¿CUÁL FUE EL MOTIVO?</Text>
            <TextInput
              style={[Styles.input, {
 width: Metrics.buttonWidth, borderWidth: StyleSheet.hairlineWidth, height: 100, textAlignVertical: 'top',
}]}
              underlineColorAndroid="transparent"
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
    const { feedback, user } = this.state;
    const has_attended = parseInt(feedback.has_attended) === 1 ? 'SI' : 'NO';
    return (
      <View style={[Styles.containerPrimary, { backgroundColor: '#f8f8f8' }]}>
        <View style={Styles.flexColumn}>
          <Text style={[Styles.title, { color: 'black' }]}>
            Sobre {user ? user.first_name : ''}
          </Text>
          <View>
            <PickerSB
              containerStyle={[Styles.pickerContainer, { width: Metrics.buttonWidth }]}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16 }}
              selectedValue={has_attended}
              list={[{ label: 'SI', value: '1' }, { label: 'NO', value: '0' }]}
              onSelectValue={option => this.setState({ profile: Object.assign(feedback, { has_attended: option.value }) })}
            />
            <Text style={[Styles.inputText, { color: Colors.primary }]}>ASISTIÓ AL PARTIDO</Text>
          </View>
          {this.renderHasAttended()}
          {this.renderNotHasAttended()}
          <View style={[Styles.flexRow, { marginTop: 20 }]}>
            <View>
              <Text style={[Styles.inputText, { color: Colors.primary }]}>DEJANOS TU COMENTARIO</Text>
              <TextInput
                style={[Styles.input, {
 width: Metrics.buttonWidth, borderWidth: StyleSheet.hairlineWidth, height: 100, textAlignVertical: 'top',
}]}
                underlineColorAndroid="transparent"
                placeholderTextColor="lightgrey"
                multiline
                value={feedback.comment}
                onChangeText={comment => this.setState({ feedback: Object.assign(feedback, { comment }) })}
                ref={(r) => { this._comment = r; }}
                returnKeyType="next"
                onBlur={() => console.log('blur')}
                enablesReturnKeyAutomatically
                onKeyPress={event => console.log(event)}
              />
            </View>
          </View>
        </View>
      </View>
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
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="never"
        >
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={styles.centerContent}>
            <Text style={[Styles.title, { marginBottom: 0 }]}>Feedback</Text>
            <Text style={[Styles.subTitle, { width: 260 }]}>
              Es importante que siempre califiques
              y nos cuentes sobre tu partido
            </Text>
          </View>
          <View style={[Styles.flexColumn, { paddingBottom: 20 }]}>
            {/* this.renderUser() */}
            {/* this.infoMatch() */}
            {this.renderInfoUser()}
            {this.renderFeedback()}
          </View>
          {!this.state.complete &&
            <View style={[styles.flexRow, { paddingBottom: 20, paddingLeft: 20, backgroundColor: '#f8f8f8' }]}>
              <TouchableItem
                pointerEvents="box-only"
                accessibilityComponentType="button"
                accessibilityTraits="button"
                testID="profile-available"
                delayPressIn={0}
                style={{ backgroundColor: Colors.primary, padding: 5, width: Metrics.width }}
                onPress={this.saveFeedback.bind(this)}
                pressColor={Colors.primary}
              >
                <View pointerEvents="box-only">
                  <Text style={[Styles.inputText, { color: 'white', textAlign: 'center', fontSize: 22 }]}>GUARDAR</Text>
                </View>
              </TouchableItem>
            </View>
          }
        </KeyboardAwareScrollView>
        <FooterButtons navigate={navigation.navigate} />
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
