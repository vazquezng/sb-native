import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  Slider,
  Dimensions
} from 'react-native';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const { width } = Dimensions.get('window');

const three = ((width - 40) / 3) - 5;
const two = ((width - 40) / 2) - 5;


const mapStateToProps = state => ({
  user: state.user,
});

@connect(mapStateToProps)
class ViewPlayerScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Perfil del usuario',
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
      profile: null,
      inviteMatch: false,
    };
  }

  componentWillMount() {
    const { user, navigation } = this.props;
    fetch(`${API}/user/${navigation.state.params.user}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      },
    })
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({
        profile: responseJson.user,
      });
    });

    if (navigation.state.params.inviteMatch) {
      this.setState({
        inviteMatch: true,
      });
    }
  }

  renderInformationBasic(profile) {
    if (!profile) {
      return null;
    }

    return (
      <View style={styles.containerInformationBasic}>
        <View style={[Styles.flexRow, { justifyContent: 'center' }]}>
          {this.renderImage(profile)}
        </View>

        <View style={{ marginTop: 20 }}>
          <View
            style={[ Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center'} ]}
          >
            <Text style={[Styles.inputText, { color: 'white' }]}>NOMBRE</Text>
            <Text
              style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: width / 2, textAlign: 'right', textAlignVertical: 'top' }]}
            >{profile.first_name}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow, Styles.borderBottomInput ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>APELLIDO</Text>
            <Text
              style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: width / 2, textAlign: 'right', textAlignVertical: 'top' }]}
            >{profile.last_name}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow, Styles.borderBottomInput ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>EMAIL</Text>
            <Text
              style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: width / 2, textAlign: 'right', textAlignVertical: 'top' }]}
            >{profile.email}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>SEXO</Text>
          </View>
          <View style={[ Styles.borderBottomInput ]}>
            <View style={[ Styles.flexRow, { backgroundColor: 'black', borderRadius: 10, marginBottom: 10 }]}>
              <TouchableItem
                style={[{ borderRadius: 10, flex: 0.5 }, profile.sexo === 'male' ? { backgroundColor: Colors.primary } : {} ]}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16  }}>Hombre</Text>
              </TouchableItem>
              <TouchableItem
                style={[{ borderRadius: 10, flex: 0.5 }, profile.sexo === 'female' ? { backgroundColor: Colors.primary } : {}]}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Mujer</Text>
              </TouchableItem>
            </View>
          </View>
        </View>

        <View style={[Styles.borderBottomInput, { marginTop: 10 }]}>
          <View style={[ Styles.flexRow ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>EDAD</Text>
            <Text style={[Styles.inputText, { color: '#079ac8' }]}>{profile.years}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>UBICACIÓN</Text>
          </View>
          <View style={[ Styles.flexRow ]}>
            <Text style={[Styles.inputText, { color: 'white', fontSize: 12, color: '#b8b9bb' }]}>Mi ubicación actual</Text>
            <Text style={[Styles.inputText, { color: '#079ac8', fontSize: 12 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >{profile.address && profile.address.substring(0, 30)}...</Text>
          </View>
        </View>

      </View>
    );
  }

  renderImage(profile) {
    const imageURI = profile && profile.image ? profile.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: 160,
          height: 160,
          borderRadius: 80,
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          borderBottomLeftRadius: 100,
          borderBottomRightRadius: 100 }}
      />
    );
  }

  renderScanInformation(profile) {
    if (!profile) {
      return null;
    }

    return (
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <Text style={Styles.inputText}>NIVEL DE JUEGO</Text>
          <Text style={{ color: Colors.primary }}>{profile.game_level}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <Text style={Styles.inputText}>DISTANCIA PARA JUGAR UN PARTIDO</Text>
          <Text style={{ color: Colors.primary }}>{profile.distance}KM</Text>
        </View>

        <View style={[Styles.flexColumn, Styles.flexAlignLeft, { marginTop: 20 }]}>
          <Text style={Styles.inputText}>SOBRE</Text>
          <View>
            <Text
              style={[Styles.input, { height: 100, width: width - 50, borderWidth: 1, textAlignVertical: 'top' }]}
              value={profile.about}
            >{profile.about}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { profile } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="keyboard-arrow-left"
          onPress={() => this.props.navigation.navigate(params.backName, { ...params.backParams })}
          title="Información del Jugador"
        />
        <ScrollView   style={[Styles.containerPrimary, { paddingHorizontal: 0 }]}>
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={styles.centerContent}>
            <Text style={Styles.title}>Perfil del usuario</Text>
          </View>
          {this.renderInformationBasic(profile)}
          <View style={{ backgroundColor: '#eeeeee', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8}}>
            <Text style={{ color: '#86888b'}}>INFORMACIÓN DE EXPLORACIÓN</Text>
          </View>
          {this.renderScanInformation(profile)}
          {/* <View style={Styles.flexColumn}>
            {this.renderImage(profile)}
          </View>
          {this.renderInfoUser(profile)} */}
          {this.state.inviteMatch &&
            <TouchableItem
              delayPressIn={0}
              style={[Styles.btnSave, { marginBottom: 20, marginTop: 20  }]}
              onPress={() => this.props.navigation.navigate('Match', { inviteUser: profile.id })}
            >
              <View pointerEvents="box-only">
                <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>CREAR UN PARTIDO</Text>
              </View>
            </TouchableItem>
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerInformationBasic: {
    backgroundColor: '#393e44',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  centerContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default ViewPlayerScreen;
