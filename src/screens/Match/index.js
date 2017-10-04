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
  Slider,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
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
  { label: '2.5', value: 2.5 },
  { label: '3.0', value: 3 },
  { label: '3.5', value: 3.5 },
  { label: '4.0', value: 4 },
  { label: '4.5', value: 4.5 },
  { label: '5.0', value: 5 },
  { label: '5.5', value: 5.5 },
  { label: '6.0', value: 6 },
  { label: '6.5', value: 6.5 },
  { label: '7.0', value: 7 },
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
        game_level_from: 2.5,
        game_level_to: 7,
        years_from: 18,
        years_to: 99,
        type: 'singles',
        sexo: 'mixto',
        about: '',
      },
      canchas: [],
      sexo: 'male',
      now: moment().format('DD-MM-YYYY'),
      time: moment().format('LT'),
      region: {
        latitude: 0,
        longitude: 0,
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
      inviteUser: null,
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

    console.log(navigation.state.params);
    fetch(`${API}/canchas`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        canchas: responseJson.canchas.filter(c => c.state === 'confirmed'),
      }, () => {
        if (navigation.state.params && navigation.state.params.selectedCancha) {
          this.changeCancha({ value: navigation.state.params.selectedCancha });
        }
      });
    });

    if (navigation.state.params && navigation.state.params.inviteUser) {
      this.setState({
        inviteUser: navigation.state.params.inviteUser,
      });
    } else {
      this.setState({
        inviteUser: null,
      });
    }

    this.props.navigation.setParams({ inviteUser: null, selectedCancha: null });
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

  handleChangeSexo(sexo) {
    const { match } = this.state;
    this.setState({ match: Object.assign(match, { sexo }) });
  }
  handleChangeType(type) {
    const { match } = this.state;
    this.setState({ match: Object.assign(match, { type }) });
  }

  changeLevel(levels) {
    this.setState({
      match: Object.assign(this.state.match, {
        game_level_from: levels[0],
        game_level_to: levels[1],
      }),
    });
  }

  changeYears(years) {
    this.setState({
      match: Object.assign(this.state.match, {
        years_from: years[0],
        years_to: years[1],
      }),
    });
  }

  onSetCurrentPosition(data, details) {
    const { navigation } = this.props;
    const { match } = this.state;

    if (details && details.address_components) {
      console.log(details);
      match.address = details && details.formatted_address ? details.formatted_address : match.address;
      match.address_lat = details && details.geometry ? details.geometry.location.lat : match.address_lat;
      match.address_lng = details && details.geometry ? details.geometry.location.lng : match.address_lng;

      const region = {
        latitude: parseFloat(match.address_lat),
        longitude: parseFloat(match.address_lng),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      const markers = [{
        latlng: {
          latitude: parseFloat(match.address_lat),
          longitude: parseFloat(match.address_lng),
        },
        title: match.club_name,
        description: '',
      }];

      this.setState({ match, region, markers });

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
    return (parseInt(match.years_from) > 17 && parseInt(match.years_to) > 18);
  }

  save() {
    const { match, inviteUser } = this.state;
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
            if (inviteUser) {
              const params = { user_id: inviteUser, match_id: responseJson.match_id };
              fetch(`${API}/match/invite`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${this.props.user.profile.token}`,
                  'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify(params),
              })
              .then(() => this.createMatchSuccess(responseJson.match_id));
            } else {
              this.createMatchSuccess(responseJson.match_id);
            }
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

  createMatchSuccess(idMatch) {
    this.setState({
      spinnerVisible: false,
    });
    Alert.alert(
      'Atención',
      'Se guardo correctamente el partido.',
      [
        { text: 'OK', onPress: () => this.props.navigation.navigate('SuggestedPlayers', { match: idMatch, backName: 'MatchDetail', backParams: { match: idMatch } }) },
      ],
      { cancelable: false },
    );
  }



  renderOtherClub() {
    const { match } = this.state;
    if (match.id_cancha === '0') {
      return (
        <View>
          <View style={[ Styles.flexRow, { marginTop: 0 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <TextInput
                multiline
                style={[Styles.input, { width: width - 50 }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={match.club_name}
                onChangeText={club_name => this.setState({ match: Object.assign(match, { club_name }) })}
                ref={(r) => { this._clubName = r; }}
                returnKeyType={'next'}
              />
              <Text style={Styles.inputText}>NOMBRE DEL CLUB</Text>
            </View>
          </View>
          <View style={[Styles.flexRow, { marginTop: 10 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <GooglePlacesAutocomplete
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
                  language: 'es',
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
              <Text style={[Styles.inputText, { marginTop: 0}]}>INGRESE DIRECCION</Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
  }

  renderLevel() {
    const { match } = this.state;

    return (
      <View>
        <View style={[Styles.flexRow, { marginTop: 20 }]}>
          <Text style={{ fontSize: 14, fontWeight: '600' }}>NIVEL DE JUEGO</Text>
          <Text style={{ fontSize: 14, color: Colors.primary }}>{match.game_level_from}-{match.game_level_to}</Text>
        </View>
        <View style={[ Styles.flexRow, { marginTop: 20, justifyContent: 'center', alignItems: 'center'  }]}>
          <View style={[ Styles.flexColumn, { justifyContent: 'center', alignItems: 'center' }]}>
            <MultiSlider
              values={[match.game_level_from, match.game_level_to]}
              onValuesChangeFinish={this.changeLevel.bind(this)}
              sliderLength={280}
              min={2.5}
              max={7}
              step={0.5}
              selectedStyle={{
                backgroundColor: Colors.primary,
              }}
              unselectedStyle={{
                backgroundColor: 'silver',
              }}
              containerStyle={{
                height: 20,
              }}
              trackStyle={{
                height: 5,
                backgroundColor: 'red',
              }}
              touchDimensions={{
                height: 40,
                width: 40,
                borderRadius: 20,
                slipDisplacement: 40,
              }}
            />
          </View>
        </View>
        <View style={[Styles.flexRow, Styles.borderBottomInput, { marginTop: 10, paddingBottom: 10 }]}>
          <Text style={{ fontSize: 14 }}>2.5</Text>
          <Text style={{ fontSize: 14}}>7</Text>
        </View>
      </View>
    );
  }

  renderSexo(match) {
    return (
      <View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600' }}>SEXO</Text>
        </View>
        <View style={[ Styles.borderBottomInput ]}>
          <View style={[ Styles.flexRow, { backgroundColor: '#71767a', borderRadius: 20, marginBottom: 10 }]}>
            <TouchableItem
              onPress={ () => this.handleChangeSexo('mixto') }
              style={[{ borderRadius: 10, flex: 0.5 }, match.sexo === 'mixto' ? { backgroundColor: Colors.primary } : {} ]}>
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16  }}>Todos</Text>
            </TouchableItem>
            <TouchableItem
              onPress={ () => this.handleChangeSexo('male') }
              style={[{ borderRadius: 10, flex: 0.5 }, match.sexo === 'male' ? { backgroundColor: Colors.primary } : {} ]}>
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16  }}>Hombre</Text>
            </TouchableItem>
            <TouchableItem
              onPress={ () => this.handleChangeSexo('female') }
              style={[{ borderRadius: 10, flex: 0.5 }, match.sexo === 'female' ? { backgroundColor: Colors.primary } : {}]}>
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Mujer</Text>
            </TouchableItem>
          </View>
        </View>
      </View>
    );
  }

  renderType(match) {
    return (
      <View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600' }}>TIPO DE PARTIDO</Text>
        </View>
        <View style={[ Styles.borderBottomInput ]}>
          <View style={[ Styles.flexRow, { backgroundColor: '#71767a', borderRadius: 20, marginBottom: 10 }]}>
            <TouchableItem
              onPress={ () => this.handleChangeType('singles') }
              style={[{ borderRadius: 10, flex: 0.5 }, match.type === 'singles' ? { backgroundColor: Colors.primary } : {} ]}>
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16  }}>Singles</Text>
            </TouchableItem>
            <TouchableItem
              onPress={ () => this.handleChangeType('dobles') }
              style={[{ borderRadius: 10, flex: 0.5 }, match.type === 'dobles' ? { backgroundColor: Colors.primary } : {} ]}>
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16  }}>Dobles</Text>
            </TouchableItem>
          </View>
        </View>
      </View>
    );
  }

  renderYear() {
    const { match } = this.state;
    return (
      <View>
        <View style={[Styles.flexRow, { marginTop: 20 }]}>
          <Text style={{ fontSize: 14, fontWeight: '600' }}>EDAD</Text>
          <Text style={{ fontSize: 14, color: Colors.primary }}>{match.years_from}-{match.years_to}</Text>
        </View>
        <View style={[ Styles.flexRow, { marginTop: 20, justifyContent: 'center', alignItems: 'center'  }]}>
          <View style={[ Styles.flexColumn, { justifyContent: 'center', alignItems: 'center' }]}>
            <MultiSlider
              values={[match.years_from, match.years_to]}
              onValuesChangeFinish={this.changeYears.bind(this)}
              sliderLength={280}
              min={18}
              max={99}
              step={1}
              selectedStyle={{
                backgroundColor: Colors.primary,
              }}
              unselectedStyle={{
                backgroundColor: 'silver',
              }}
              containerStyle={{
                height: 20,
              }}
              trackStyle={{
                height: 5,
                backgroundColor: 'red',
              }}
              touchDimensions={{
                height: 60,
                width: 60,
                borderRadius: 20,
                slipDisplacement: 40,
              }}
            />
          </View>
        </View>
        <View style={[Styles.flexRow, Styles.borderBottomInput, { marginTop: 10, paddingBottom: 10 }]}>
          <Text style={{ fontSize: 14 }}>18</Text>
          <Text style={{ fontSize: 14}}>99</Text>
        </View>
      </View>
    );
  }

  renderDate(match) {
    return (
      <View>
        <View style={{ marginTop: 20 }}>
          <View
            style={[ Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center'} ]}
          >
            <Text style={[Styles.inputText, { fontWeight: '600' }]}>FECHA</Text>
            <DatePicker
              style={[{ width: two }]}
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
                  right: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  borderWidth: 0,
                },
              }}
              iconSource={require('../../assets/ico-fecha.png')}
              onDateChange={date => this.setState({ match: Object.assign(match, { date }) })}
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View
            style={[Styles.flexRow, Styles.borderBottomInput, { alignItems: 'center' }]}
          >
            <Text style={[Styles.inputText, { fontWeight: '600' }]}>HORA</Text>
            <DatePicker
              style={{ width: two }}
              date={this.state.match.hour}
              mode="time"
              placeholder="HORA"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  right: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                  borderWidth: 0,
                },
              }}
              iconSource={require('../../assets/ico-hora.png')}
              onDateChange={hour => this.setState({ match: Object.assign(match, { hour }) })}
            />
          </View>
        </View>
      </View>
    );
  }

  renderPoint() {
    const { match, canchas } = this.state;

    const pickerCanchas = [{ label: 'OTRA', value: '0' }];
    canchas.forEach((c) => {
      pickerCanchas.push({ label: c.name, value: c.id });
    });
    let valueClub = pickerCanchas.find(pc => pc.value === match.id_cancha);
    valueClub = valueClub ? valueClub.label : 'OTRA';

    return (
      <View style={[Styles.borderBottomInput, {paddingBottom: 10} ]}>
        <View style={[Styles.flexRow, { justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }]}>
          <Text style={{ fontSize: 14, fontWeight: '600' }}>LUGAR</Text>
          <Image
            source={require('../../assets/ico-lugar.png')}
            style={{ width: 27, height: 35 }}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.flexRow, { marginTop: 5 }]}>
          <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
            <PickerSB
              containerStyle={[Styles.pickerContainer, { width: (width - 50) }]}
              buttonStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: 'black', fontSize: 16 }}
              selectedValue={valueClub}
              list={pickerCanchas}
              onSelectValue={this.changeCancha.bind(this)}
            />

            <Text style={[Styles.inputText, { width: width - 50 }]}>CANCHAS REGISTRADAS</Text>
          </View>
        </View>
        <View>
          {this.renderOtherClub()}
        </View>
        { this.state.region.latitude !== 0 &&
          <View style={{ flex: 1, height: 200}}>
            <MapView
              zoomEnabled={true}
              minZoomLevel={16}
              maxZoomLevel={20}
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
        }
      </View>
    );
  }

  renderComments(match) {
    return (
      <View style={[styles.flexRow, { marginTop: 20 }]}>
        <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
          <Text style={[Styles.inputText, { fontWeight: '600'}]}>COMENTARIO</Text>
          <TextInput
            multiline
            style={[Styles.input, { width: width - 50, borderWidth: 1, height: 100 }]}
            underlineColorAndroid={'transparent'}
            placeholderTextColor="lightgrey"
            value={match.about}
            onChangeText={about => this.setState({ match: Object.assign(match, { about }) })}
            ref={(r) => { this._about = r; }}
            returnKeyType={'next'}
          />
        </View>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { match, canchas } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Crear Partido"
        />
        <KeyboardAwareScrollView
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps={'never'}
           getTextInputRefs={() => {
             return [this._about];
           }}>
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View>
            <Text style={Styles.title}>Creá un Partido</Text>
            <View style={[Styles.flexRow, { backgroundColor: '#efedf0', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 2, justifyContent: 'center', alignItems: 'center'}]}>
              <Text style={[Styles.subTitle, { color: '#414143', fontSize: 12 }]}>COMPLETÁ LOS DATOS Y QUE EL </Text>
              <Text style={[Styles.subTitle, { color: Colors.primary, fontSize: 12 }]}>JUEGO EMPIECE.</Text>
            </View>
          </View>

          <View style={Styles.containerPrimary}>
            {this.renderDate(match)}
            {this.renderPoint(match)}
            {this.renderLevel()}
            {this.renderSexo(match)}
            {this.renderType(match)}
            {this.renderYear()}
            {this.renderComments(match)}


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
          </View>

        </KeyboardAwareScrollView>
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
