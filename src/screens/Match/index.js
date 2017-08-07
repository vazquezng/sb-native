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
import Entypo from 'react-native-vector-icons/Entypo';
import DatePicker from 'react-native-datepicker';
import MapView from 'react-native-maps';
import  { GooglePlacesAutocomplete } from '@components/GooglePlaceAutoComplete';
import moment from 'moment';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';
import PickerSB from '@components/Picker';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';
import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const { width } = Dimensions.get('window');

const three = ( (width - 40) / 3) - 5;
const two = ( (width - 40) / 2) - 5;

const pickerSexo = [{ label: 'Mixto', value: 'mixto' }, { label: 'Masculino', value: 'male' }, { label: 'Femenino', value: 'female' }];
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
const pickerType = [
  { label: 'Singles', value: 'singles' },
  { label: 'Dobles', value: 'dobles' },
];

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
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <TextInput
                multiline
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
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
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

  renderLevel() {
    const { match } = this.state;

    let valueGameLevelFrom = pickerGameLevel.find(pgl => pgl.value === match.game_level_from);
    valueGameLevelFrom = valueGameLevelFrom ? valueGameLevelFrom.label : '2.5';
    let valueGameLevelTo = pickerGameLevel.find(pgl => pgl.value === match.game_level_to);
    valueGameLevelTo = valueGameLevelTo ? valueGameLevelTo.label : '2.5';
    let valueSexo = pickerSexo.find(ps => ps.value === match.sexo);
    valueSexo = valueSexo ? valueSexo.label : 'Mixto';
    let valueType = pickerType.find(ps => ps.value === match.type);
    valueType = valueType ? valueType.label : 'Singles';

    return (
      <View>
        <View style={{marginTop: 20}}>
          <Text style={{ color: Colors.primary, fontSize: 20}}>NIVEL DE JUEGO</Text>
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
            <PickerSB
              containerStyle={[ Styles.input, { width: two, height: 32 }]}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16, marginLeft: 5 }}
              selectedValue={valueGameLevelFrom.toString()}
              list={pickerGameLevel}
              onSelectValue={game_level_from => this.setState({ match: Object.assign(match, { game_level_from: game_level_from.value }) })}
            />
            <Text style={[Styles.inputText, { width: (Metrics.buttonWidth - 20) / 2, borderColor: Colors.primary, borderTopWidth: 1 }]}>DESDE</Text>
          </View>
          <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
            <PickerSB
              containerStyle={[ Styles.input, { width: two, height: 32 }]}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16, marginLeft: 5 }}
              selectedValue={valueGameLevelTo.toString()}
              list={pickerGameLevel}
              onSelectValue={game_level_to => this.setState({ match: Object.assign(match, { game_level_to: game_level_to.value }) })}
            />
            <Text style={[Styles.inputText, { width: (Metrics.buttonWidth - 20) / 2, borderColor: Colors.primary, borderTopWidth: 1 }]}>HASTA</Text>
          </View>
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
            <PickerSB
              containerStyle={[ Styles.input, { width: two, height: 32 }]}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={Styles.input}
              selectedValue={valueSexo}
              list={pickerSexo}
              onSelectValue={sexo => this.setState({ match: Object.assign(match, { sexo: sexo.value }) })}
            />
            <Text style={[Styles.inputText, { width: (Metrics.buttonWidth - 20) / 2, borderColor: Colors.primary, borderTopWidth: 1 }]}>SEXO</Text>
          </View>
          <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
            <PickerSB
              containerStyle={[ Styles.input, { width: two, height: 32 }]}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={Styles.input}
              selectedValue={valueType}
              list={pickerType}
              onSelectValue={type => this.setState({ match: Object.assign(match, { type: type.value }) })}
            />
            <Text style={[Styles.inputText, { width: (Metrics.buttonWidth - 20) / 2, borderColor: Colors.primary, borderTopWidth: 1 }]}>TIPO DE PARTIDO</Text>
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
          <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
            <TextInput
              multiline
              style={[Styles.input, { width: two }]}
              keyboardType="numeric"
              placeholder="EDAD"
              underlineColorAndroid={'transparent'}
              placeholderTextColor="lightgrey"
              returnKeyType="done"
              value={match.years_from}
              onChangeText={(years_from) => this.setState({ match: Object.assign(match, { years_from }) })}
            />
            <Text style={Styles.inputText}>DESDE</Text>
          </View>
          <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
            <TextInput
              multiline
              style={[Styles.input, { width: two }]}
              keyboardType="numeric"
              placeholder="EDAD"
              returnKeyType="done"
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


  changeCancha(canchaOption) {
    const { match } = this.state;
    const idCancha = canchaOption.value;
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
      console.log(details);
      match.address = details && details.formatted_address ? details.formatted_address : match.address;
      if (details && details.geometry) {
        if (commonFunc.isFunction(details.geometry.location.lat)) {
          match.address_lat = details.geometry.location.lat();
        } else {
          match.address_lat = details.geometry.location.lat;
        }
        if (commonFunc.isFunction(details.geometry.location.lng)) {
          match.address_lng = details.geometry.location.lng();
        } else {
          match.address_lng = details.geometry.location.lng;
        }
      } else {
        match.address_lat = match.address_lat;
        match.address_lng = match.address_lng;
      }

      this.setState({ match });
    }
  }

  validTime(hour) {
    hour = new Date(moment(hour,'HH:mm'));
    if (hour.getHours() < 8 || hour.getHours() > 23) {
      Alert.alert(
        'Error',
        'El partido se debe jugar entre las 8 y las 23hs.',
        [
          { text: 'OK', onPress: () => console.log('OK') },
        ],
        { cancelable: false },
      );
      // this.toaster.pop({type:'info', body:'El partido se debe jugar entre las 8 y las 23hs.'});
      return false;
    }

    if (hour.getMinutes() !== 0 && hour.getMinutes() !== 30) {
      Alert.alert(
        'Error',
        'En la hora del partido, solo se admiten intervalos de 30 minutos.',
        [
          { text: 'OK', onPress: () => console.log('OK') },
        ],
        { cancelable: false },
      );
      // this.toaster.pop({type:'info', body:'En la hora del partido, solo se admiten intervalos de 30 minutos.'});
      // mahour = new Date(moment('15:30', 'HH:mm'));
      return false;
    }
    return true;
  }

  validateDate(match) {
    const now = new Date();
    const date = new Date(moment(match.date));
    if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate() && match.hour < now) {
      Alert.alert(
        'Error',
        'La fecha y/o hora ya pasarón.',
        [
          { text: 'OK', onPress: () => console.log('OK') },
        ],
        { cancelable: false },
      );
      return false;
    }

    return true;
  }

  validDateHour(match) {
    return (this.validateDate(match) && this.validTime(match.hour));
  }
  validCancha(match) {
    return (match.address !== '' && match.address_lat !== '' && match.address_lng !== '' && match.club_name !== '');
  }
  validYear(match) {
    return (parseInt(match.years_from) > 18 && parseInt(match.years_to) > 18);
  }

  save() {
    const { match } = this.state;
    hour = new Date(moment(match.hour,'HH:mm'));
    if (this.validDateHour(match)) {
      if (this.validCancha(match) && this.validYear(match)) {
        this.setState({ spinnerVisible: true }, () => {
          fetch(`${API}/match`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.props.user.profile.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.assign(match, { hour: hour.toLocaleTimeString() })),
          })
          .then(response => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            this.setState({
              spinnerVisible: false,
            });
            Alert.alert(
              'Atención',
              'Se guardo correctamente el partido.',
              [
                { text: 'OK', onPress: () => this.props.navigation.navigate('SuggestedPlayers', { match: responseJson.match_id }) },
              ],
              { cancelable: false },
            );
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
  }


  render() {
    const { navigation } = this.props;
    const { match, canchas } = this.state;

    const pickerCanchas = [{ label: 'OTRA', value: '0' }];
    canchas.forEach((c) => {
      pickerCanchas.push({ label: c.name, value: c.id });
    });

    let valueClub = pickerCanchas.find(pc => pc.value === match.id_cancha);
    valueClub = valueClub ? valueClub.label : 'OTRA';

    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Crear Partido"
        />
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View>
            <Text style={Styles.title}>Creá un Partido</Text>
            <Text style={Styles.subTitle}>Completá los datos y que el juego empiece.</Text>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
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
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
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
                onDateChange={hour => this.setState({ match: Object.assign(match, { hour }) })}
              />
              <Text style={Styles.inputText}>HORA</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <PickerSB
                containerStyle={[Styles.input, { width: (width - 50), height: 28 }]}
                buttonStyle={{ height: 40, justifyContent: 'center' }}
                textStyle={{ color: 'black', fontSize: 16 }}
                selectedValue={valueClub}
                list={pickerCanchas}
                onSelectValue={this.changeCancha.bind(this)}
              />

              <Text style={[Styles.inputText, { width: width - 50, borderColor: Colors.primary, borderTopWidth: 1 }]}>CANCHAS REGISTRADAS</Text>
            </View>
          </View>

          <View>
            {this.renderOtherClub()}
          </View>
          <View style={{ flex: 1, height: 200}}>
            <MapView
              style={styles.map}
              region={this.state.region}
              onRegionChange={this.onRegionChange}
            >
              {this.state.markers && this.state.markers.map((marker, index) => (
                <MapView.Marker
                  key={index}
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
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <Text style={Styles.inputText}>COMENTARIO</Text>
              <TextInput
                multiline
                style={[Styles.input, { width: width - 50, borderWidth: 1, height: 100 }]}
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
