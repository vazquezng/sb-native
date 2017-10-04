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
class MyCalificationsDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Feedback',
    headerLeft: (
      <HeaderButton
        icon="keyboard-arrow-left"
        onPress={() => navigation.navigate('MyCalifications')}
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
      feedback: null,
      match: null,
      user_from: null,
      user_to: null,
    };
  }

  componentWillMount() {
    const { user, navigation } = this.props;
    fetch(`${API}/feedback/detail`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
        'Content-Type':'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        id_match: navigation.state.params.id_match,
        id_user_from: navigation.state.params.id_user_from,
        id_user_to: navigation.state.params.id_user_to,
      }),
    })
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({
        spinnerVisible: false,
        feedback: responseJson.feedback,
        match: responseJson.match,
        user_from: responseJson.user_from,
        user_to: responseJson.user_to,
      });
    })
    .catch(() => {
      this.setState({ spinnerVisible: false });
    });
  }

  renderUser() {
    const { user_to, match } = this.state;
    if (user_to) {
      return (
        <View style={Styles.flexRow}>
          <View style={{ flex: 0.3 }}>
            {this.renderImage(user_to)}
          </View>
          <View style={[Styles.flexColumn, { marginLeft: 10, flex: 0.7 }]}>
            <View style={[Styles.borderBottomInput, { borderColor: Colors.primary }]}>
              <Text style={{ fontSize: 12 }}>{user_to.name}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'border' }}>JUGADOR</Text>
            </View>
            <View style={[Styles.borderBottomInput, { marginTop: 10, borderColor: Colors.primary }]}>
              <Text style={{ fontSize: 12 }}>{match.address}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'border' }}>LUGAR</Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
  }

  renderImage(user_to){
    const imageURI = user_to && user_to.image ? user_to.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: 100,
          height: 100,
          borderRadius: 50,
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          borderBottomLeftRadius: 100,
          borderBottomRightRadius: 100 }}
      />
    );
  }

  renderMatch() {
    const { match } = this.state;
    if (match) {
      return (
        <View style={[Styles.flexRow, { marginTop: 20 }]}>
          <View style={{ flex: 0.3 }}>
            <View style={[Styles.borderBottomInput, { borderColor: Colors.primary }]}>
              <Text style={{ fontSize: 12, width: Metrics.buttonWidth / 3 }}>{match.date}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'border' }}>FECHA</Text>
            </View>
          </View>
          <View style={[Styles.flexColumn, { marginLeft: 10, flex: 0.7 }]}>
            <View style={[Styles.borderBottomInput, { borderColor: Colors.primary }]}>
              <Text style={{ fontSize: 12, width: Metrics.buttonWidth / 3 }}>{match.hour}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'border' }}>HORA</Text>
            </View>
          </View>
          <View style={[Styles.flexColumn, { marginLeft: 10, flex: 0.7 }]}>
            <View style={[Styles.borderBottomInput, { borderColor: Colors.primary }]}>
              <Text style={{ fontSize: 12, width: Metrics.buttonWidth / 3 }}>{match.type}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'border' }}>TIPO DE PARTIDO</Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
  }

  renderFeedback() {
    const { feedback } = this.state;
    if (feedback) {
      return (
        <View style={[Styles.flexColumn]}>
          <View style={[Styles.flexRow, { marginTop: 20, justifyContent: 'space-between' }]}>
            <View>
              <View style={[Styles.borderBottomInput, { borderColor: Colors.primary }]}>
                <Text style={{ fontSize: 12, width: Metrics.buttonWidth / 2 }}>{feedback.game_level}</Text>
              </View>
              <View>
                <Text style={{ fontWeight: 'border' }}>NIVEL DE JUEGO</Text>
              </View>
            </View>
            <View style={[Styles.flexColumn, { marginLeft: 10}]}>
              <View style={[Styles.borderBottomInput, { borderColor: Colors.primary }]}>
                <Text style={{ fontSize: 12, width: Metrics.buttonWidth / 2 }}>{feedback.punctuality}</Text>
              </View>
              <View>
                <Text style={{ fontWeight: 'border' }}>PUNTUALIDAD</Text>
              </View>
            </View>
          </View>

          <View style={[Styles.flexRow, { marginTop: 20 }]}>
            <View>
              <View style={[Styles.borderBottomInput, { borderColor: Colors.primary }]}>
                <Text style={{ fontSize: 12, width: Metrics.buttonWidth / 2 }}>{feedback.respect}</Text>
              </View>
              <View>
                <Text style={{ fontWeight: 'border' }}>RESPETO</Text>
              </View>
            </View>
            <View style={[Styles.flexColumn, { marginLeft: 10 }]}>
              <View style={[Styles.borderBottomInput, { borderColor: Colors.primary }]}>
                <Text style={{ fontSize: 12, width: Metrics.buttonWidth / 2 }}>{feedback.has_attended ? 'SI' : 'NO' }</Text>
              </View>
              <View>
                <Text style={{ fontWeight: 'border', width: Metrics.buttonWidth / 2 }}>ASISTIO AL PARTIDO</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View>
              <View style={[Styles.borderBottomInput, { borderColor: Colors.primary }]}>
                <Text style={{ fontSize: 12, width: Metrics.buttonWidth - 50 }}>{feedback.comment}</Text>
              </View>
              <View>
                <Text style={{ fontWeight: 'border' }}>COMENTARIO</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return null;
  }


  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="keyboard-arrow-left"
          onPress={() => navigation.navigate('MyCalifications')}
          title="Mi Calificacion"
        />
        <KeyboardAwareScrollView
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps={'never'}
          style={Styles.containerPrimary}
        >
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={Styles.title}>Mi Calificacion</Text>
            {this.renderUser()}
            {this.renderMatch()}
            {this.renderFeedback()}
          </View>
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


export default MyCalificationsDetailsScreen;
