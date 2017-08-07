import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  Slider,
  Dimensions,
  NativeModules,
  Alert,
  Platform,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-picker';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';
import  { GooglePlacesAutocomplete } from '@components/GooglePlaceAutoComplete';
import ModalAvailable from '@components/ModalAvailable';
import PickerSB from '@components/Picker';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

import { saveProfile, logout } from '@store/user/actions';
import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

import Notifications from '@utils/Notifications';

const { width } = Dimensions.get('window');

const three = ((width - 40) / 3) - 5;
const two = ((width - 40) / 2) - 5;
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

const API_UPLOAD_PHOTOID = `${API}/user/profile/image`;
const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  saveProfile: profile => dispatch(saveProfile(profile)),
  logout: () => dispatch(logout()),
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
    Notifications.setNavigation(props.navigation);
    const { user } = props;
    this.state = {
      spinnerVisible: false,
      profile: user.profile,
      canchas: [],
      modalAvailable: false,
    };
  }

  componentWillMount() {
    const { user, logout, navigation } = this.props;
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
        profile: Object.assign(user.profile, { availability: responseJson.availability }),
      });
    });
  }

  componentDidMount() {
    const devices = Notifications.getDevice();
    const { profile } = this.state;
    console.log(devices);
    if (devices && (!profile.onesignal_app_pushToken || profile.onesignal_app_pushToken !== devices.pushToken) ) {
      profile.onesignal_app_pushToken = devices.pushToken;
      profile.onesignal_app_userId = devices.userId;
      this.saveProfile(false);
    }
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
    console.log(response);
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
        console.log(returnMessage);
        console.log(returnCode);
        console.log(resultData);

        if (returnCode === 200) {
          const { profile } = this.state;
          profile.image = resultData.data;
          this.setState({ profile });
        }
      });
    });
  }

  _getCountryFromAddress(details) {
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
      profile.city = details.types && details.types[0] === 'street_address' ? details.vicinity : profile.city;
      profile.country = details.types && details.types[0] === 'street_address' ? this.getCountryFromAddress(details): profile.country;
      profile.address = details && details.formatted_address ? details.formatted_address : profile.address;
      profile.address_lat = details && details.geometry ? details.geometry.location.lat() : profile.address_lat;
      profile.address_lng = details && details.geometry ? details.geometry.location.lng() : profile.address_lng;

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

  saveProfile(alert = true) {
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
              ],
              { cancelable: false },
            );
          }
          this.props.saveProfile(this.state.profile);
        });
      });
    });
  }

  handleChangeSexo(sexo) {
    const { profile } = this.state;
    this.setState({ profile: Object.assign(profile, { sexo: sexo.value }) });
  }

  handleChangeGameLevel(game_level) {
    const { profile } = this.state;
    this.setState({ profile: Object.assign(profile, { game_level: game_level.value }) });
  }

  handleChangeClubMember(club_membrenderImageer) {
    const { profile } = this.state;
    this.setState({ profile: Object.assign(profile, { club_member: club_member.value }) });
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

  render() {
    const { navigation } = this.props;
    const { profile, canchas } = this.state;
    const single = Boolean(profile.single);
    const double = Boolean(profile.double);

    const pickerCanchas = [{label: 'OTRA', value: '0'}];
    canchas.forEach((c) => {
      pickerCanchas.push({ label: c.name, value: c.id });
    });

    const valueSexo = pickerSexo.find(ps => ps.value === profile.sexo).label;
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
        <ScrollView style={Styles.containerPrimary}>
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View>
            <Text style={Styles.title}>Tu Perfil</Text>
            <Text style={Styles.subTitle}>Completá los datos de tu perfil para contactarte con otros jugadores.</Text>
          </View>
          <View style={styles.flexRow}>
              <View style={styles.containerPhoto}>
                {this.renderImage(profile)}
              </View>
              <View style={styles.containerPhoto}>
                  <TouchableOpacity
                    onPress={() => this.getCamera()}>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.8, paddingBottom: 10 }}>
                      <Entypo
                        name='camera'
                        size={20}
                      />
                      <Text style={styles.textImage}>Tomar Foto</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.getGalery()}>
                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                      <Entypo
                        name='image'
                        size={20}
                      />
                      <Text style={styles.textImage}>Seleccionar</Text>
                    </View>
                  </TouchableOpacity>
              </View>
          </View>

          <View style={[Styles.flexRow, { marginTop: 20 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <TextInput
                style={[Styles.input, { width: two }]}
                placeholder="NOMBRE"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                multiline
                value={profile.first_name}
                onChangeText={(first_name) => this.setState({ profile: Object.assign(profile, { first_name }) })}
              />
              <Text style={Styles.inputText}>NOMBRE</Text>
            </View>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <TextInput
                placeholder="APELLIDO"
                style={[Styles.input, { width: two }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                multiline
                value={profile.last_name}
                onChangeText={(last_name) => this.setState({ profile: Object.assign(profile, { last_name }) })}
              />
              <Text style={Styles.inputText}>APELLIDO</Text>
            </View>
          </View>

          <View style={[Styles.flexRow, { marginTop: 20 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <TextInput
                placeholder="EMAIL"
                style={[Styles.input, { width: Metrics.buttonWidth }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                multiline
                value={profile.email}
                onChangeText={(email) => this.setState({ profile: Object.assign(profile, { email }) })}
              />
              <Text style={Styles.inputText}>EMAIL</Text>
            </View>
          </View>


          <View style={[Styles.flexRow, { marginTop: 20 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <TextInput
                style={[Styles.input, { width: two }]}
                placeholder="EDAD"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                multiline
                value={profile.years.toString()}
                onChangeText={(years) => this.setState({ profile: Object.assign(profile, { years }) })}
              />
              <Text style={Styles.inputText}>EDAD</Text>
            </View>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <PickerSB
                containerStyle={[ Styles.pickerContainer, { width: two }]}
                buttonStyle={{ height: 40, justifyContent: 'center' }}
                textStyle={{ color: 'black', fontSize: 16, marginLeft: 5 }}
                selectedValue={valueSexo}
                list={pickerSexo}
                onSelectValue={this.handleChangeSexo.bind(this)}
              />
              <Text style={[Styles.inputText, { width: two, borderColor: Colors.primary, borderTopWidth: 1 }]}>SEXO</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <GooglePlacesAutocomplete
                ref={(ref) => this._googlePlace = ref}
                placeholder='DIRECCION'
                minLength={1}
                autoFocus={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  this.onSetCurrentPosition(data, details);
                }}
                getDefaultValue={() => profile.address }
                query={{
                  key: 'AIzaSyDZOdwsf3vZEFQws7WldOWKeibaWiMjJCg',
                  language: 'en',
                  types: ['(cities)'],
                }}
                styles={{
                  description: { fontSize: 14, color: Colors.second, width: width - 50 },
                  predefinedPlacesDescription: { fontSize: 14, color: Colors.second, width: width - 50 },
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                GoogleReverseGeocodingQuery={{
                }}
                GooglePlacesSearchQuery={{
                }}
                enablePoweredByContainer = {true}
                filterReverseGeocodingByTypes={['locality',
                                                'administrative_area_level_1',
                                                'sublocality',
                                                'postal_code',
                                                'country' ]}
                predefinedPlaces={[]}
              />
              <Text style={Styles.inputText}>DIRECCION</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <PickerSB
                containerStyle={[Styles.pickerContainer, { width: (width - 50) }]}
                buttonStyle={{ height: 40, justifyContent: 'center' }}
                textStyle={{ color: 'black', fontSize: 16, marginLeft: 5 }}
                selectedValue={valueGameLevel.toString()}
                list={pickerGameLevel}
                onSelectValue={this.handleChangeGameLevel.bind(this)}
              />
              <Text style={[Styles.inputText, { width: width - 50, borderColor: Colors.primary, borderTopWidth: 1 }]}>NIVEL DE JUEGO</Text>
            </View>
          </View>

          <View style={[Styles.flexRow, { justifyContent: 'space-around', marginTop: 20 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <Switch
                onTintColor={Colors.primary}
                value={single}
                onValueChange={single => this.setState({ profile: Object.assign(profile, { single }) })}
              />
              <Text style={Styles.inputText}>SINGLES</Text>
            </View>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <Switch onTintColor={Colors.primary} value={double} onValueChange={(double) => this.setState({ profile: Object.assign(profile, { double }) })} />
              <Text style={Styles.inputText}>DOBLES</Text>
            </View>
          </View>

          <View style={[Styles.flexRow, { justifyContent: 'flex-start', marginTop: 20 }]}>
            <TouchableItem
              accessibilityComponentType="button"
              accessibilityTraits="button"
              testID="profile-available"
              delayPressIn={0}
              pressColor={Colors.primary}
              style={{ borderColor: Colors.primary, borderWidth: 0.8, borderRadius: 10, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10 }}
              onPress={this.openModalAvailable.bind(this)}
            >
              <View>
                <Entypo
                  name="calendar"
                  size={24}
                />
                <View>
                  <Text>DISPONIBILIDAD</Text>
                </View>
              </View>
            </TouchableItem>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Text>2</Text>
            <Text style={{ color: Colors.primary }}>{this.state.profile.distance}KM</Text>
            <Text>50</Text>
          </View>
          <View style={[styles.flexRow]}>
            <View style={[styles.flexColumn, { flex: 1, width: width - 50 }]}>
              <Slider
                style={{ width: width - 50, height: 33 }}
                minimumValue={2}
                maximumValue={50}
                maximumTrackTintColor={Colors.primary}
                minimumTrackTintColor={Colors.primary}
                thumbTintColor={Colors.primary}
                step={2}
                value={profile.distance}
                onValueChange={(distance) => this.setState({ profile: Object.assign(profile, { distance }) })} />
              <Text style={Styles.inputText}>DISTANCIA PARA JUGAR UN PARTIDO</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <PickerSB
                containerStyle={[Styles.pickerContainer, { width: (width - 50) }]}
                buttonStyle={{ height: 40, justifyContent: 'center' }}
                textStyle={{ color: 'black', fontSize: 16 }}
                selectedValue={valueClubMember}
                list={pickerCanchas}
                onSelectValue={this.handleChangeClubMember.bind(this)}
              />
              <Text style={[Styles.inputText, { width: width - 50, borderColor: Colors.primary, borderTopWidth: 1 }]}>SOS SOCIO DE ALGUN CLUB</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <Text style={Styles.inputText}>SOBRE MI</Text>
              <TextInput
                multiline
                numberOfLines={4}
                style={[Styles.input, { height: 100, width: width - 50, borderWidth: 1 }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={profile.about}
                onChangeText={(about) => this.setState({ profile: Object.assign(profile, { about }) })}
              />
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20, marginBottom: 20 }]}>
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
        </ScrollView>
        <ModalAvailable
          availability={profile.availability}
          onClose={this.closeModalAvailable.bind(this)}
          isVisible={this.state.modalAvailable}
          onSuccess={this.saveAvailable.bind(this)}></ModalAvailable>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPhoto: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default ProfileScreen;
