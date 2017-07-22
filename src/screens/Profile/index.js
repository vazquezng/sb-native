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
  Picker,
  Switch,
  Slider,
  Dimensions,
  NativeModules,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Entypo from 'react-native-vector-icons/Entypo';
import  ImagePicker from 'react-native-image-picker';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';
import  { GooglePlacesAutocomplete } from '@components/GooglePlaceAutoComplete';
import ModalAvailable from '@components/ModalAvailable';


import Styles from '@theme/Styles';
import Colors from '@theme/Colors';

import { saveProfile } from '@store/user/actions';
import API from '@utils/api';

const { width } = Dimensions.get('window');

const three = ((width - 40) / 3) - 5;
const two = ((width - 40) / 2) - 5;
const FileUpload = NativeModules.UploadFile;

const API_UPLOAD_PHOTOID = `${API}/user/profile/image`;
const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  saveProfile: profile => dispatch(saveProfile(profile)),
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

    const { user } = props;
    this.state = {
      spinnerVisible: false,
      profile: user.profile,
      canchas: [],
      modalAvailable: false,
    };
  }

  componentWillMount() {
    fetch(`${API}/canchas`, {
      method:'GET'
    })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        canchas: responseJson.canchas.filter(c => c.state === 'confirmed'),
      });
    });
  }

  getCamera() {
      // Launch Camera:
    ImagePicker.launchCamera(options, (response) => {
      console.log(response);
    });
  }
  getGalery() {
      // Launch Camera:
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log(response);
      if (!response.didCancel) {
        this.setState({ spinnerVisible: true });
        const obj = {
          uploadUrl: API_UPLOAD_PHOTOID,
          method: 'POST', // default 'POST',support 'POST' and 'PUT'
          headers: {
            Authorization: `Bearer ${this.props.user.profile.token}`,
          },
          files: [
            {
              name: 'files',
              filename: 'avatar.jpg',
              filepath: response.uri,
              filetype: response.type,
            },
          ],
          fields: {
          },
        };
        FileUpload.upload(obj, (returnCode, returnMessage, resultData) => {
          this.setState({ spinnerVisible: false });
          console.log(returnCode);
          console.log(resultData);
        });
      }
    });
  }


  save() {
    console.log(this.state.profile);
  }

  renderImage() {
    const { user } = this.state;
    const imageURI = user && user.profile ? user.profile.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: 160,
          height: 160,
          borderTopLeftRadius: 100,
          borderTopRightRadius: 100,
          borderBottomLeftRadius: 100,
          borderBottomRightRadius: 100 }}
      />
    );
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
      profile.address_lat = details && details.geometry ? details.geometry.location.lat() : profile.lat;
      profile.address_lng = details && details.geometry ? details.geometry.location.lng() : profile.lng;

      this.setState({ profile });
    }
  }

  renderItemCancha(cancha, index) {
    return <Picker.Item key={index} label={cancha.name} value={cancha.id} />
  }

  openModalAvailable() {
    this.setState({ modalAvailable: true });
  }

  closeModalAvailable() {
    this.setState({ modalAvailable: false });
  }

  render() {
    const { navigation } = this.props;
    const { profile } = this.state;
    return (
      <View style={{ flex: 1}}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Mi Perfil"
        />
        <ScrollView style={Styles.containerPrimary}>
          <Spinner visible={this.state.spinnerVisible} />
          <View>
            <Text style={Styles.title}>Tu Perfil</Text>
            <Text style={Styles.subTitle}>Completá los datos de tu perfil para contactarte con otros jugadores.</Text>
          </View>
          <View style={styles.flexRow}>
              <View>
                {this.renderImage()}
              </View>
              <View style={styles.containerPhoto}>
                  <TouchableOpacity
                    onPress={() => this.getCamera()}>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 0.8, paddingBottom: 10}}>
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

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <TextInput
                style={[Styles.input, { width: three }]}
                placeholder="NOMBRE"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={profile.first_name}
                onChangeText={(first_name) => this.setState({ profile: Object.assign(profile, { first_name }) })}
              />
              <Text style={Styles.inputText}>NOMBRE</Text>
            </View>
            <View style={[styles.flexColumn]}>
              <TextInput
                placeholder="APELLIDO"
                style={[Styles.input, { width: three }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={profile.last_name}
                onChangeText={(last_name) => this.setState({ profile: Object.assign(profile, { last_name }) })}
              />
              <Text style={Styles.inputText}>APELLIDO</Text>
            </View>
            <View style={[styles.flexColumn]}>
              <TextInput
                placeholder="EMAIL"
                style={[Styles.input, { width: three }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={profile.email}
                onChangeText={(email) => this.setState({ profile: Object.assign(profile, { email }) })}
              />
              <Text style={Styles.inputText}>EMAIL</Text>
            </View>
          </View>


          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <TextInput
                style={[Styles.input, { width: two }]}
                placeholder="EDAD"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={profile.years.toString()}
                onChangeText={(years) => this.setState({ profile: Object.assign(profile, { years }) })}
              />
              <Text style={Styles.inputText}>EDAD</Text>
            </View>
            <View style={[styles.flexColumn]}>
              <Picker
                style={{ width: two, height: 33 }}
                selectedValue={profile.sexo}
                onValueChange={(sexo, itemIndex) => this.setState({ profile: Object.assign(profile, { sexo }) })}>
                <Picker.Item label="Masculino" value="male" />
                <Picker.Item label="Femenino" value="female" />
              </Picker>
              <Text style={Styles.inputText}>SEXO</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
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
            <View style={[styles.flexColumn]}>
              <Picker
                style={{ width: width - 50, height: 33 }}
                selectedValue={profile.game_level.toString()}
                onValueChange={(game_level, itemIndex) => this.setState({ profile: Object.assign(profile, { game_level }) })}
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
          </View>

          <View style={[styles.flexRow, { justifyContent: 'space-around', marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <Switch />
              <Text style={Styles.inputText}>SINGLES</Text>
            </View>
            <View style={[styles.flexColumn]}>
              <Switch />
              <Text style={Styles.inputText}>DOBLES</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { justifyContent: 'center', marginTop: 20 }]}>
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
                step={2}
                value={profile.distance}
                onValueChange={(distance) => this.setState({ profile: Object.assign(profile, { distance }) })} />
              <Text style={Styles.inputText}>DISTANCIA PARA JUGAR UN PARTIDO</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <Picker
                style={{ width: width - 50, height: 33 }}
                selectedValue={this.state.club_member}
                onValueChange={(itemValue) => this.setState({ club_member: itemValue })}>
                <Picker.Item label="OTRA" value="0" />
                {this.state.canchas && this.state.canchas.map((cancha, index)=>{
                  return this.renderItemCancha(cancha, index);
                })}
              </Picker>
              <Text style={Styles.inputText}>SOS SOCIO DE ALGUN CLUB</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <Text style={Styles.inputText}>SOBRE MI</Text>
              <TextInput
                style={[Styles.input, { width: width - 50, borderWidth: 0.8, height: 100 }]}
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
              onPress={this.save.bind(this)}
              pressColor={Colors.primary}
            >
              <View pointerEvents="box-only">
                <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center'}]}>GUARDAR</Text>
              </View>
            </TouchableItem>
          </View>
        </ScrollView>
        <ModalAvailable onClose={this.closeModalAvailable.bind(this)} isVisible={this.state.modalAvailable}></ModalAvailable>
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
