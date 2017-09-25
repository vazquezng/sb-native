import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Slider,
  Dimensions,
  NativeModules,
  Alert,
  Modal,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';
import  { GooglePlacesAutocomplete } from '@components/GooglePlaceAutoComplete';
import ModalAvailable from '@components/ModalAvailable';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

import { saveProfile, logout } from '@store/user/actions';

import API from '@utils/api';
import commonFunc from '@utils/commonFunc';
import Notifications from '@utils/Notifications';

const { width } = Dimensions.get('window');
const FileUpload = NativeModules.UploadFile;

const pickerSexo = [{ label: 'Masculino', value: 'male' }, { label: 'Femenino', value: 'female' }];
const pickerGameLevel = [
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3' },
  { label: '3.5', value: '3.5' },
  { label: '4.0', value: '4' },
  { label: '4.5', value: '4.5' },
  { label: '5.0', value: '5' },
  { label: '5.5', value: '5.5' },
  { label: '6.0', value: '6' },
  { label: '6.5', value: '6.5' },
  { label: '7.0', value: '7' },
];
const availability = [{ day: '0', allDay: false, morning: false, evening: false, night: false },  // LUNES
                      { day: '1', allDay: false, morning: false, evening: false, night: false },  // MARTES
                      { day: '2', allDay: false, morning: false, evening: false, night: false },  // MIÉRCOLES
                      { day: '3', allDay: false, morning: false, evening: false, night: false },  // JUEVES
                      { day: '4', allDay: false, morning: false, evening: false, night: false },  // VIERNES
                      { day: '5', allDay: false, morning: false, evening: false, night: false },  // SÁBADO
                      { day: '6', allDay: false, morning: false, evening: false, night: false }]; // DOMINGO

const API_UPLOAD_PHOTOID = `${API}/user/profile/image`;
const mapStateToProps = state => ({
  user: state.user,
  screen: state.screen,
});

const mapDispatchToProps = dispatch => ({
  saveProfile: profile => dispatch(saveProfile(profile)),
  logout: () => dispatch(logout())
});

const options = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
  },
};

@connect(mapStateToProps, mapDispatchToProps)
class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Profile',
    headerLeft: (
      <HeaderButton
        icon="menu"
        onPress={() => navigation.navigate('DrawerOpen')}
        tintColor={'white'}
      />
    ),
    headerStyle: {
      backgroundColor: '#3f78c3',
    },
    headerTintColor: 'white',
  });

  constructor(props) {
    super(props);
    Notifications.setNavigation(props.navigation);
    const { user } = props;

    user.profile.years = user.profile.years ? user.profile.years : '';
    this.state = {
      spinnerVisible: false,
      profile: user.profile,
      canchas: [],
      modalAvailable: false,
      modalAddress: false,
    };
  }

  componentWillMount() {
    const { user, logout, navigation, screen } = this.props;

    fetch(`${API}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      },
    })
    .then(response => response.json())
    .then((responseJson) => {
      if (responseJson && responseJson.length) {
        if (responseJson[0] === 'Token has expired') {
          logout();
          navigation.navigate('Login');
        }
      }
    });

    fetch(`${API}/canchas`, {
      method:'GET'
    })
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({
        canchas: responseJson.canchas.filter(c => c.state === 'confirmed'),
      });
    });

    fetch(`${API}/user/retrieveUserAvailability`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      }
    })
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({
        profile: Object.assign(user.profile, { availability: responseJson.availability.length === 0 ? availability : responseJson.availability }),
      });
    });

    const self = this;
    if (!user.profile.complete) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const initialPosition = JSON.stringify(position);
          this.setState({ initialPosition });
          fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true`)
          .then(response => response.json())
          .then((responseJson) => {
            self.onSetCurrentPosition(null, responseJson.results[0]);
            console.log(responseJson);
          })
          console.log(position);
        },
        (error) => {
          console.log(error);
          Alert.alert(
            'Atención',
            'No pudimos detectar tu ubicación. Activa el GPS para disfrutar mejor de Slambow',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
          );
        },
        { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 },
      );
    }
  }

  componentDidMount() {
    const devices = Notifications.getDevice();
    console.log(devices);
    const { profile } = this.state;
    if (devices &&
      (!profile.onesignal_app_pushToken
        || profile.onesignal_app_pushToken !== devices.pushToken)) {
      profile.onesignal_app_pushToken = devices.pushToken;
      profile.onesignal_app_userId = devices.userId;

      this.setState({
        profile,
      }, () => {
        this.saveProfile(false);
      });
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  componentWillBlur() {
    console.log('componentWillBlur');
  }

  getCamera() {
      // Launch Camera:
    ImagePicker.launchCamera(options, (response) => {
      if (!response.didCancel) {
        this.saveImage(response);
      }
    });
  }
  getGalery() {
      // Launch Camera:
    ImagePicker.launchImageLibrary(options, (response) => {
      if (!response.didCancel) {
        this.saveImage(response);
      }
    });
  }

  saveImage(response) {
    const { profile } = this.state;
    this.setState({ spinnerVisible: true }, () => {
      const obj = {
        uploadUrl: API_UPLOAD_PHOTOID,
        method: 'POST', // default 'POST',support 'POST' and 'PUT'
        headers: {
          Authorization: `Bearer ${profile.token}`,
        },
        files: [
          {
            name: 'file',
            filename: response.fileName,
            filepath: response.uri,
            filetype: response.type,
          },
        ],
        file: {
          name: 'file',
          filename: response.fileName,
          filepath: response.uri,
          filetype: response.type,
        },
        fields: {
        },
      };
      FileUpload.upload(obj, (returnCode, returnMessage, resultData) => {
        this.setState({ spinnerVisible: false });
        if (commonFunc.isAndroid) {
          if (returnCode === 200) {
            const { profile } = this.state;
            profile.image = resultData.data;
            this.setState({ profile });
          }
        } else if (returnMessage.status === 200) {
          const { profile } = this.state;
          profile.image = returnMessage.data;
          this.setState({ profile });
        }
      });
    });
  }

  _getCountryFromAddress = (details) => {
    for (let i = 0; i < details.address_components.length; i++) {
      for (let j = 0; j < details.address_components[i].types.length; j++) {
        if (details.address_components[i].types[j] === 'country') {
          return details.address_components[i].long_name;
        }
      }
    }
  }

  onSetCurrentPosition(data, details) {
    const { navigation } = this.props;
    const { profile } = this.state;

    if (details && details.address_components) {
      console.log(details);
      profile.city = details.types && details.types[0] === 'street_address' ? details.vicinity : profile.city;
      profile.country = details.types && details.types[0] === 'street_address' ? this._getCountryFromAddress(details): profile.country;
      profile.address = details && details.formatted_address ? details.formatted_address : profile.address;
      profile.address_lat = details && details.geometry ? details.geometry.location.lat : profile.address_lat;
      profile.address_lng = details && details.geometry ? details.geometry.location.lng : profile.address_lng;

      this.setState({ profile });
    }
  }

  openModalAvailable() {
    this.setState({ modalAvailable: true });
  }

  closeModalAvailable() {
    this.setState({ modalAvailable: false });
  }

  saveAvailable = (availability) => {
    this.setState({
      spinnerVisible: true,
      profile: Object.assign(this.state.profile, { availability }),
    }, () => {
      this.closeModalAvailable();
    });

    fetch(`${API}/user/saveAvailability`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.state.profile.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({availability}),
    })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        spinnerVisible: false,
      });
      Alert.alert(
        'Atención',
        'Tu disponibilidad se guardo correctamente!',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    });
  }

  validString(str) {
    return str !== null && typeof str === 'string' && str !== '';
  }
  validAddress(profile) {
    return (profile.address && profile.address !== '' && profile.address_lat !== '' && profile.address_lng !== '');
  }

  formComplete() {
    const { profile } = this.state;
    if( this.validString(profile.first_name) && this.validString(profile.last_name)
        && this.validString(profile.email) && this.validString(profile.about) && this.validString(profile.years.toString()) && this.validAddress(profile)) {
          return true;
    }
    return false;
  }

  saveProfile(alert = true) {
    if (alert && !this.formComplete()) {
      Alert.alert(
        'Atención',
        'Debes completar todos los campos.',
        [
          { text: 'OK', onPress: () => this.setState({ spinnerVisible: false }) },
        ],
        { cancelable: false },
      );

      return false;
    }

    this.setState({
      spinnerVisible: true,
    }, () => {
      const profile = {};
      const keys = Object.keys(this.state.profile);
      keys.forEach((k) => {
        if (k !== 'availability' && k !== 'newuser' && k !== 'token') {
          profile[k] = this.state.profile[k];
        }
      });

      fetch(`${API}/user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.state.profile.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })
      .then(response => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          spinnerVisible: false,
        }, () => {
          if (alert) {
            Alert.alert(
              'Atención',
              'Tu perfil se guardo correctamente!',
              [
                { text: 'OK', onPress: () => this.setState({ spinnerVisible: false }) },
                { text: 'Crear Partido', onPress: () => { this.setState({ spinnerVisible: false });this.props.navigation.navigate('Match'); }},
              ],
              { cancelable: false },
            );
          }
          this.state.profile.complete = 1;
          this.props.saveProfile(this.state.profile);
        });
      });
    });
  }

  handleChangeSexo(sexo) {
    const { profile } = this.state;
    this.setState({ profile: Object.assign(profile, { sexo }) });
  }

  handleChangeGameLevel(game_level) {
    const { profile } = this.state;
    this.setState({ profile: Object.assign(profile, { game_level: game_level.value }) });
  }

  handleChangeClubMember(club_member) {
    const { profile } = this.state;
    this.setState({ profile: Object.assign(profile, { club_member: club_member.value }) });
  }

  aplicarAddress() {
    this.setState({ modalAddress: false })
  }

  renderInformationBasic() {
    const { profile } = this.state;
    return (
      <View style={styles.containerInformationBasic}>
        <View style={Styles.flexRow}>
          <View style={styles.containerPhoto}>
              <TouchableItem
                onPress={() => this.getCamera()}>
                <View style={{ flexDirection: 'row', backgroundColor: '#00a5d7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}>
                  <Entypo
                    name='camera'
                    size={28}
                    style={{ color: 'white' }}
                  />
                </View>
              </TouchableItem>
          </View>
          <View style={styles.containerPhoto}>
            {this.renderImage(profile)}
          </View>
          <View style={styles.containerPhoto}>
              <TouchableItem
                onPress={() => this.getGalery()}>
                <View style={{ flexDirection: 'row', backgroundColor: '#00a5d7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}>
                  <Entypo
                    name='image'
                    size={28}
                    style={{ color: 'white' }}
                  />
                </View>
              </TouchableItem>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <View
            style={[ Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center'} ]}
          >
            <Text style={[Styles.inputText, { color: 'white' }]}>NOMBRE</Text>
            <TextInput
              multiline={!commonFunc.isAndroid}
              numberOfLines={1}
              underlineColorAndroid="transparent"
              placeholderTextColor="lightgrey"
              style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
              value={profile.first_name}
              onChangeText={first_name => this.setState({ profile: Object.assign(profile, { first_name }) })}
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow, Styles.borderBottomInput ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>APELLIDO</Text>
            <TextInput
              multiline={!commonFunc.isAndroid}
              numberOfLines={1}
              underlineColorAndroid="transparent"
              placeholderTextColor="lightgrey"
              style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
              value={profile.last_name}
              onChangeText={last_name => this.setState({ profile: Object.assign(profile, { last_name }) })}
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow, Styles.borderBottomInput ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>EMAIL</Text>
            <TextInput
              multiline={!commonFunc.isAndroid}
              numberOfLines={1}
              underlineColorAndroid="transparent"
              placeholderTextColor="lightgrey"
              keyboardType="email-address"
              style={[{ color: '#079ac8', marginBottom: 0, paddingBottom: 3, width: width / 2, textAlign: 'right', textAlignVertical: 'top', fontSize: 14 }]}
              value={profile.email}
              onChangeText={email => this.setState({ profile: Object.assign(profile, { email }) })}
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>SEXO</Text>
          </View>
          <View style={[ Styles.borderBottomInput ]}>
            <View
              style={[Styles.flexRow, { backgroundColor: 'black',
                borderRadius: 10,
                marginBottom: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10 }]}
            >
              <TouchableItem
                onPress={ () => this.handleChangeSexo('male') }
                style={[{ borderRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, flex: 0.5 }, profile.sexo === 'male' ? { backgroundColor: Colors.primary } : {} ]}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 14  }}>Hombre</Text>
              </TouchableItem>
              <TouchableItem
                onPress={ () => this.handleChangeSexo('female') }
                style={[{ borderRadius: 10, flex: 0.5 }, profile.sexo === 'female' ? { backgroundColor: Colors.primary } : {}]}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>Mujer</Text>
              </TouchableItem>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>EDAD</Text>
            <Text style={[Styles.inputText, { color: '#079ac8' }]}>{profile.years}</Text>
          </View>
          <View style={[Styles.flexRow, Styles.borderBottomInput]}>
            <View style={[Styles.flexColumn, { flex: 1, width: width - 50 }]}>
              <Slider
                style={{ width: width - 50, height: 33 }}
                minimumValue={18}
                maximumValue={99}
                maximumTrackTintColor={Colors.primary}
                minimumTrackTintColor={Colors.primary}
                thumbTintColor={Colors.primary}
                step={1}
                value={parseInt(profile.years)}
                onValueChange={years => this.setState({ profile: Object.assign(profile, { years }) })} />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[ Styles.flexRow ]}>
            <Text style={[Styles.inputText, { color: 'white' }]}>UBICACIÓN</Text>
            <TouchableItem
              onPress={() => this.setState({ modalAddress: true })}
            >
              <View>
                <Text style={[Styles.inputText, { color: 'white' }]}>Buscar ></Text>
              </View>
            </TouchableItem>

          </View>
          <View style={[Styles.flexRow]}>
            <Text style={[Styles.inputText, { fontSize: 12, color: '#b8b9bb', marginRight: 4 }]}>Mi ubicación actual</Text>
            <Text
              style={[Styles.inputText, { color: '#079ac8', fontSize: 12 }]}
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

  renderScanInformation() {
    const { profile } = this.state;

    return (
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <Text style={Styles.inputText}>NIVEL DE JUEGO</Text>
          <Text style={{ color: Colors.primary }}>{profile.game_level}</Text>
        </View>
        <View style={[Styles.flexRow]}>
          <View style={[Styles.flexColumn, { flex: 1, width: width - 50 }]}>
            <Slider
              style={{ width: width - 50, height: 33 }}
              minimumValue={2.5}
              maximumValue={7}
              maximumTrackTintColor={Colors.primary}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={Colors.primary}
              step={0.5}
              value={parseInt(profile.game_level)}
              onValueChange={(game_level) => this.setState({ profile: Object.assign(profile, { game_level }) })} />
          </View>
        </View>
        <View style={[ Styles.borderBottomInput, { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5} ]}>
          <Text>2.5</Text>
          <Text>7.0</Text>
        </View>

        <View style={[Styles.flexRow, { justifyContent: 'flex-start', marginTop: 20 }]}>
          <TouchableItem
            accessibilityComponentType="button"
            accessibilityTraits="button"
            testID="profile-available"
            delayPressIn={0}
            pressColor={Colors.primary}
            style={[ Styles.borderBottomInput, { width: (width - 50), paddingBottom: 5 } ]}
            onPress={this.openModalAvailable.bind(this)}
          >
            <View style={Styles.flexRow}>
              <View>
                <Text>DISPONIBILIDAD</Text>
              </View>
              <Entypo
                name="calendar"
                size={24}
              />
            </View>
          </TouchableItem>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <Text style={Styles.inputText}>DISTANCIA PARA JUGAR UN PARTIDO</Text>
          <Text style={{ color: Colors.primary }}>{profile.distance}KM</Text>
        </View>
        <View style={[Styles.flexRow]}>
          <View style={[Styles.flexColumn, { flex: 1, width: width - 50 }]}>
            <Slider
              style={{ width: width - 50, height: 33 }}
              minimumValue={2}
              maximumValue={50}
              maximumTrackTintColor={Colors.primary}
              minimumTrackTintColor={Colors.primary}
              thumbTintColor={Colors.primary}
              step={2}
              value={profile.distance}
              onValueChange={distance => this.setState({ profile: Object.assign(profile, { distance }) })}
            />
          </View>
        </View>
        <View style={[ Styles.borderBottomInput, { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5} ]}>
          <Text>2Km</Text>
          <Text>50Km</Text>
        </View>

        <View style={[Styles.flexRow, { marginTop: 20 }]}>
          <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
            <Text style={Styles.inputText}>SOBRE MI</Text>
            <View>
              <TextInput
                multiline={!commonFunc.isAndroid}
                numberOfLines={4}
                style={[Styles.input, { height: 100, width: width - 50, borderWidth: 1, textAlignVertical: 'top' }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={profile.about}
                onChangeText={about => this.setState({ profile: Object.assign(profile, { about }) })}
                ref={r => { this._about = r; }}
                returnKeyType={'go'}
              />
            </View>
          </View>
        </View>

        <View style={[Styles.flexRow, { marginTop: 20, marginBottom: 20 }]}>
          <TouchableItem
            pointerEvents="box-only"
            accessibilityComponentType="button"
            accessibilityTraits="button"
            testID="profile-available"
            delayPressIn={0}
            style={Styles.btnSave}
            onPress={() => this.saveProfile()}
            pressColor={Colors.primary}
          >
            <View pointerEvents="box-only">
              <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center'}]}>GUARDAR</Text>
            </View>
          </TouchableItem>
        </View>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { profile, canchas } = this.state;
    const single = Boolean(profile.single);
    const double = Boolean(profile.double);

    const pickerCanchas = [{label: 'OTRA', value: '0'}];
    canchas.forEach((c) => {
      pickerCanchas.push({ label: c.name, value: c.id });
    });

    let valueSexo = pickerSexo.find(ps => ps.value === profile.sexo);
    valueSexo = valueSexo ? valueSexo.label : 'Masculino';
    let valueGameLevel = pickerGameLevel.find(pgl => pgl.value === profile.game_level);
    valueGameLevel = valueGameLevel ? valueGameLevel.label : '2.5';
    let valueClubMember = pickerCanchas.find(pc => pc.value === profile.club_member);
    valueClubMember = valueClubMember ? valueClubMember.label : 'OTRA';

    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="menu"
          onPress={() => navigation.navigate('DrawerOpen')}
          title="Mi Perfil"
        />
        <KeyboardAwareScrollView
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={'never'}
          getTextInputRefs={() => [this._about]}
          style={[Styles.containerPrimary, { paddingHorizontal: 0 }]}
        >
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View>
            <Text style={Styles.title}>Tu Perfil</Text>
            <Text style={Styles.subTitle}>Completá los datos de tu perfil para contactarte con otros jugadores.</Text>
          </View>
          {this.renderInformationBasic()}

          <View style={{ backgroundColor: '#eeeeee', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8}}>
            <Text style={{ color: '#86888b'}}>INFORMACIÓN DE EXPLORACIÓN</Text>
          </View>

          {this.renderScanInformation()}
        </KeyboardAwareScrollView>

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalAddress}
          onRequestClose={() => console.log('close')}
          supportedOrientations={['portrait', 'landscape']}
        >
          <KeyboardAwareScrollView keyboardDismissMode="interactive"
                                   keyboardShouldPersistTaps={'always'}
                                   style={{ marginTop: 22, paddingHorizontal: 20 }}>
            <View>
              <Text style={Styles.title}>Tu Perfil</Text>
              {/* <Text style={Styles.subTitle}>Completá tú dirección</Text> */}
            </View>
            <View style={[Styles.flexRow, { marginTop: 20 }]}>
              <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
                <GooglePlacesAutocomplete
                  ref={ref => this._googlePlace = ref}
                  placeholder="INGRESE DIRECCIÓN"
                  minLength={1}
                  autoFocus={false}
                  fetchDetails
                  onPress={(data, details = null) => {
                    this.onSetCurrentPosition(data, details);
                  }}
                  getDefaultValue={() => profile.address}
                  query={{
                    key: 'AIzaSyDZOdwsf3vZEFQws7WldOWKeibaWiMjJCg',
                    language: 'en',
                    types: ['(cities)'],
                  }}
                  styles={{
                    description: { fontSize: 14, color: Colors.second, width },
                    predefinedPlacesDescription: { fontSize: 14, color: Colors.second, width, borderWidth: 1, height: 32 },
                  }}
                  nearbyPlacesAPI="GooglePlacesSearch"
                  GoogleReverseGeocodingQuery={{
                  }}
                  GooglePlacesSearchQuery={{
                  }}
                  enablePoweredByContainer
                  filterReverseGeocodingByTypes={['locality',
                    'administrative_area_level_1',
                    'sublocality',
                    'postal_code',
                    'country']}
                  predefinedPlaces={[]}
                  caretHidden={true}
                />
                <Text style={Styles.inputText}>INGRESE DIRECCIÓN</Text>
              </View>
            </View>
           <View style={[ Styles.flexRow, { marginTop: 20, marginBottom: 20 }]}>
             <TouchableItem
               pointerEvents="box-only"
               accessibilityComponentType="button"
               accessibilityTraits="button"
               testID="profile-available"
               delayPressIn={0}
               style={Styles.btnSave}
               onPress={() => this.aplicarAddress()}
               pressColor={Colors.primary}
             >
               <View pointerEvents="box-only">
                 <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center' }]}>APLICAR</Text>
               </View>
             </TouchableItem>
           </View>
         </KeyboardAwareScrollView>
        </Modal>

        <ModalAvailable
          availability={profile.availability}
          onClose={this.closeModalAvailable.bind(this)}
          isVisible={this.state.modalAvailable}
          onSuccess={this.saveAvailable.bind(this)}
        />
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
  textImage: {
    color: Colors.primary,
    fontSize: 18,
    paddingLeft: 10,
  },
  containerPhoto: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default ProfileScreen;
