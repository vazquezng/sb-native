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
import Entypo from 'react-native-vector-icons/Entypo';
import DatePicker from 'react-native-datepicker';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import  { GooglePlacesAutocomplete } from '@components/GooglePlaceAutoComplete';
import moment from 'moment';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import API from '@utils/api';

const { width } = Dimensions.get('window');

const three = ( (width - 40) / 3) - 5;
const two = ( (width - 40) / 2) - 5;

const mapStateToProps = state => ({
  user: state.user,
});
@connect(mapStateToProps)
class MatchScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Crear Partido',
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
    this.state = {
      spinnerVisible: false,
      match: {
        date: new Date(),
        hour: new Date(moment('15:30', 'HH:mm')),
        id_cancha: '0',
        address: '',
        address_lat: '',
        address_lng: '',
        club_name: '',
        game_level_from: '2.5',
        game_level_to: '2.5',
        years_from: '',
        years_to: '',
        type: 'singles',
        sexo: 'mixto',
        about: '',
      },
      canchas: [],
      sexo: 'male',
      now: moment().format('DD-MM-YYYY'),
      time: moment().format('LT'),
      region: {
        latitude: -34.6038966,
        longitude: -58.3817433,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [{
        latlng: {
          latitude: -34.6038966,
          longitude: -58.3817433,
        },
        title: '',
        description: '',
      }],
    };
  }

  componentWillMount() {
    const { user, navigation } = this.props;
    if (!user.profile.complete) {
      Alert.alert(
        'Error',
        'Debe primero completar tú perfil',
        [
          { text: 'OK', onPress: () => navigation.navigate('Profile') },
        ],
        { cancelable: false },
      );
    }


    fetch(`${API}/canchas`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        canchas: responseJson.canchas.filter(c => c.state === 'confirmed'),
      });
    });
  }

  renderOtherClub() {
    const { match } = this.state;
    if (match.id_cancha === '0') {
      return (
        <View>
          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <TextInput
                style={[Styles.input, { width: width - 50 }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={match.club_name}
                onChangeText={club_name => this.setState({ match: Object.assign(match, { club_name }) })}
              />
              <Text style={Styles.inputText}>NOMBRE DEL CLUB</Text>
            </View>
          </View>
          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <GooglePlacesAutocomplete
                ref={(ref) => this._googlePlace = ref}
                placeholder='Indicar Dirección'
                minLength={1}
                autoFocus={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  this.onSetCurrentPosition(data, details);
                }}
                getDefaultValue={() => match.address }
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
              <Text style={Styles.inputText}>INGRESE DIRECCION</Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
  }

  renderItemCancha(cancha, index) {
    return <Picker.Item label={cancha.name} value={cancha.id} />
  }

  renderLevel() {
    const { match } = this.state;
    return (
      <View>
        <View style={{marginTop: 20}}>
          <Text style={{ color: Colors.primary, fontSize: 20}}>NIVEL DE JUEVO</Text>
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <View style={[styles.flexColumn]}>
            <Picker
              style={{ width: two, height: 33 }}
              selectedValue={match.game_level_from}
              onValueChange={game_level_from => this.setState({ match: Object.assign(match, { game_level_from }) })}
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
            <Text style={Styles.inputText}>DESDE</Text>
          </View>
          <View style={[styles.flexColumn]}>
            <Picker
              style={{ width: two, height: 33 }}
              selectedValue={match.game_level_to}
              onValueChange={game_level_to => this.setState({ match: Object.assign(match, { game_level_to }) })}
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
            <Text style={Styles.inputText}>HASTA</Text>
          </View>
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <View style={[styles.flexColumn]}>
            <Picker
              style={{ width: two, height: 33 }}
              selectedValue={match.sexo}
              onValueChange={sexo => this.setState({ match: Object.assign(match, { sexo }) })}
            >
              <Picker.Item label="Mixto" value="mixto" />
              <Picker.Item label="Masculino" value="male" />
              <Picker.Item label="Femenino" value="female" />
            </Picker>
            <Text style={Styles.inputText}>SEXO</Text>
          </View>
          <View style={[styles.flexColumn]}>
            <Picker
              style={{ width: two, height: 33 }}
              selectedValue={match.type}
              onValueChange={type => this.setState({ match: Object.assign(match, { type }) })}
            >
              <Picker.Item label="Singles" value="singles" />
              <Picker.Item label="Dobles" value="dobles" />
            </Picker>
            <Text style={Styles.inputText}>TIPO DE PARTIDO</Text>
          </View>
        </View>
      </View>
    );
  }

  renderYear() {
    const { match } = this.state;
    return (
      <View>
        <View style={{marginTop: 20}}>
          <Text style={{ color: Colors.primary, fontSize: 20}}>EDAD</Text>
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <View style={[styles.flexColumn]}>
            <TextInput
              style={[Styles.input, { width: two }]}
              keyboardType="numeric"
              placeholder="EDAD"
              underlineColorAndroid={'transparent'}
              placeholderTextColor="lightgrey"
              value={match.years_from}
              onChangeText={(years_from) => this.setState({ match: Object.assign(match, { years_from }) })}
            />
            <Text style={Styles.inputText}>DESDE</Text>
          </View>
          <View style={[styles.flexColumn]}>
            <TextInput
              style={[Styles.input, { width: two }]}
              keyboardType="numeric"
              placeholder="EDAD"
              underlineColorAndroid={'transparent'}
              placeholderTextColor="lightgrey"
              value={match.years_to}
              onChangeText={(years_to) => this.setState({ match: Object.assign(match, { years_to }) })}
            />
            <Text style={Styles.inputText}>HASTA</Text>
          </View>
        </View>
      </View>
    );
  }


  changeCancha(idCancha) {
    const { match } = this.state;
    match.id_cancha = idCancha;
    if (idCancha !== '0') {
      const cancha = this.state.canchas.find(c => c.id === parseInt(idCancha));
      match.address = cancha.address;
      match.address_lat = cancha.address_lat;
      match.address_lng = cancha.address_lng;
      match.club_name = cancha.name;
      const region = {
        latitude: parseFloat(cancha.address_lat),
        longitude: parseFloat(cancha.address_lng),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      const markers = [{
        latlng: {
          latitude: parseFloat(cancha.address_lat),
          longitude: parseFloat(cancha.address_lng),
        },
        title: cancha.name,
        description: cancha.about,
      }];

      this.setState({ match, region, markers });
    } else {
      match.address = '';
      match.address_lat = '';
      match.address_lng = '';
      match.club_name = '';
      this.setState({ match });
    }
  }

  onSetCurrentPosition(data, details) {
    const { navigation } = this.props;
    const { match } = this.state;

    if (details && details.address_components) {
      match.address = details && details.formatted_address ? details.formatted_address : match.address;
      match.address_lat = details && details.geometry ? details.geometry.location.lat() : match.address_lat;
      match.address_lng = details && details.geometry ? details.geometry.location.lng() : match.address_lng;

      this.setState({ match });
    }
  }

  validCancha(match) {
    return (match.address !== '' && match.address_lat !== '' && match.address_lng !== '' && match.club_name !== '');
  }
  validYear(match) {
    return (parseInt(match.years_from) > 18 && parseInt(match.years_to) > 18);
  }

  save() {
    const { match } = this.state;
    if (this.validCancha(match) && this.validYear(match) ) {
      this.setState({ spinnerVisible: true }, () => {
        fetch(`${API}/match`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.props.user.profile.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.assign(match, { hour: match.hour.toLocaleTimeString() })),
        })
        .then(response => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({
            spinnerVisible: false,
          });
          // this.props.navigation.navigate('SuggestedPlayers', { match: responseJson.match_id })
        });
      });
    } else {
      Alert.alert(
        'Error',
        'Complete todos los campos.',
        [
          { text: 'OK', onPress: () => console.log('OK') },
        ],
        { cancelable: false },
      );
    }
  }


  render() {
    const { navigation } = this.props;
    const { match } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Crear Partido"
        />
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          <Spinner visible={this.state.spinnerVisible} />
          <View>
            <Text style={Styles.title}>Creá un Partido</Text>
            <Text style={Styles.subTitle}>Completá los datos y que el juego empiece.</Text>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <DatePicker
                style={[{ width: two, borderBottomWidth: 0.8, borderColor: '#00a5d7' }]}
                date={match.date}
                mode="date"
                placeholder="FECHA"
                format="DD-MM-YYYY"
                minDate={this.state.now}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                    borderWidth: 0,
                  },
                }}
                onDateChange={date => this.setState({ match: Object.assign(match, { date }) })}
              />
              <Text style={Styles.inputText}>FECHA</Text>
            </View>
            <View style={[styles.flexColumn]}>
              <DatePicker
                style={{ width: two, borderBottomWidth: 0.8, borderColor: '#00a5d7' }}
                date={this.state.match.hour}
                mode="time"
                placeholder="HORA"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                    borderWidth: 0,
                  },
                }}
                onDateChange={time => this.setState({ match: Object.assign(match, { time }) })}
              />
              <Text style={Styles.inputText}>HORA</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <Picker
                style={{ width: width - 50, height: 33 }}
                selectedValue={this.state.match.id_cancha}
                onValueChange={id_cancha => this.changeCancha(id_cancha)}
              >
                <Picker.Item label="OTRA" value="0" />
                {this.state.canchas && this.state.canchas.map((cancha, index) => this.renderItemCancha(cancha, index))}
              </Picker>
              <Text style={Styles.inputText}>SOS SOCIO DE ALGUN CLUB</Text>
            </View>
          </View>

          <View>
            {this.renderOtherClub()}
          </View>
          <View style={{ flex: 1, height: 200}}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={this.state.region}
              onRegionChange={this.onRegionChange}
            >
              {this.state.markers && this.state.markers.map(marker => (
                <MapView.Marker
                  coordinate={marker.latlng}
                  title={marker.title}
                  description={marker.description}
                />
              ))}
            </MapView>
          </View>

          {this.renderLevel()}
          {this.renderYear()}

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <Text style={Styles.inputText}>SOBRE MI</Text>
              <TextInput
                style={[Styles.input, { width: width - 50, borderWidth: 0.8, height: 100 }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={match.about}
                onChangeText={about => this.setState({ match: Object.assign(match, { about }) })}
              />
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20, marginBottom: 20 }]}>
            <TouchableItem
              accessibilityComponentType="button"
              accessibilityTraits="button"
              testID="profile-available"
              delayPressIn={0}
              style={Styles.btnSave}
              onPress={() => this.save()}
              pressColor={Colors.primary}
            >
              <View>
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


export default MatchScreen;
