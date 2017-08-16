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
            <Picker
              style={{ width: Metrics.buttonWidth}}
              selectedValue={ feedback.game_level.toString()}
              onValueChange={ game_level => this.setState({ feedback: Object.assign(feedback, { game_level }) })}
            >
              <Picker.Item label="2.5" value="2.5" />
              <Picker.Item label="3.0" value="3" />
              <Picker.Item label="3.5" value="3.5" />
              <Picker.Item label="4.0" value="4" />
              <Picker.Item label="4.5" value="4.5" />
              <Picker.Item label="5.0" value="5" />
              <Picker.Item label="5.5" value="5.5" />
              <Picker.Item label="6.0" value="6" />
              <Picker.Item label="6.5" value="6.5" />
              <Picker.Item label="7.0" value="7" />
            </Picker>
            <Text style={Styles.inputText}>NIVEL DE JUEGO</Text>
          </View>

          <View style={[ styles.flexColumn, { marginTop: 10 }]}>
            <Picker
              style={{ width: Metrics.buttonWidth}}
              selectedValue={ feedback.punctuality.toString()}
              onValueChange={ punctuality => this.setState({ feedback: Object.assign(feedback, { punctuality }) })}
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
            </Picker>
            <Text style={Styles.inputText}>PUNTUALIDAD</Text>
          </View>

          <View style={[ styles.flexColumn, { marginTop: 10 }]}>
            <Picker
              style={{ width: Metrics.buttonWidth}}
              selectedValue={ feedback.respect.toString()}
              onValueChange={ respect => this.setState({ feedback: Object.assign(feedback, { respect }) })}
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
            </Picker>
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
              style={[Styles.input, { width: Metrics.buttonWidth, borderWidth: 0.8, height: 100 }]}
              underlineColorAndroid={'transparent'}
              placeholderTextColor="lightgrey"
              value={feedback.reason}
              onChangeText={reason => this.setState({ profile: Object.assign(feedback, { reason }) })}
            />
          </View>
        </View>
      );
    }
    return null;
  }

  renderFeedback() {
    const { feedback } = this.state;
    return (
      <View>
        <View style={Styles.flexColumn}>
          <Text style={[Styles.inputText, { color: Colors.primary }]}>
            INGRESA A TU CRITERIO EL NIVEL DEL JUGADOR Y COMPLETA EL RESTO DE LOS CAMPOS
          </Text>
          <View style={[styles.flexColumn]}>
            <Picker
              style={{ width: Metrics.buttonWidth}}
              selectedValue={feedback.has_attended}
              onValueChange={(has_attended) => this.setState({ profile: Object.assign(feedback, { has_attended }) })}>
              <Picker.Item label="SI" value="1" />
              <Picker.Item label="NO" value="0" />
            </Picker>
            <Text style={Styles.inputText}>ASISTIÓ AL PARTIDO</Text>
          </View>
          {this.renderHasAttended()}
          {this.renderNotHasAttended()}
          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <Text style={Styles.inputText}>Dejanos tu comentario...</Text>
              <TextInput
                style={[Styles.input, { width: Metrics.buttonWidth, borderWidth: 0.8, height: 100 }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={feedback.comment}
                onChangeText={(comment) => this.setState({ feedback: Object.assign(feedback, { comment }) })}
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
    }

    feedback.id_user_to = user.id; // jugado
    feedback.id_match = match.id;
    console.log(feedback);
    this.setState({ spinnerVisible: true });
    fetch(`${API}/feedback/save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.user.profile.token}`,
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
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
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
        </ScrollView>
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
