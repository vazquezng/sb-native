import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';
import ModalMaps from '@components/ModalMaps';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';
import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const mapStateToProps = state => ({
  user: state.user,
});
@connect(mapStateToProps)
class SearchCanchasScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Buscar Usuarios',
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
      spinnerVisible: true,
      canchas: [],
      name: '',
      modalMaps: false,
      latitude: null,
      longitude: null,
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    let name = '';
    if (params && params.name) {
      name = params.name;
      this.searchUser(name);
    } else {
      this.searchFirstUser();
    }
  }

  openModalMaps(latitude, longitude) {
    this.setState({ modalMaps: true, latitude, longitude });
  }

  closeModalMaps() {
    this.setState({ modalMaps: false });
  }

  searchFirstUser() {
    const { user } = this.props;

    fetch(`${API}/canchas/search/page`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      },
    })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        canchas: responseJson.canchas,
        spinnerVisible: false,
      });
    });
  }

  searchCanchas(name) {
    if (name !== '') {
      const { user } = this.props;
      this.setState({ name, spinnerVisible: true });

      fetch(`${API}/canchas/${name}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.profile.token}`,
        },
      })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          canchas: responseJson.canchas,
          spinnerVisible: false,
        });
      });
    } else {
      this.setState({ name, canchas: [] });
    }
  }

  renderCanchas() {
    return this.state.canchas.map((cancha, key) => this.renderCancha(cancha, key));
  }

  renderCancha(cancha, key) {
    return (
      <View key={key} style={{ marginBottom: 5 }}>
        <View style={{ backgroundColor: Colors.primary, paddingHorizontal: 10, paddingTop: 5, paddingBottom: 5 }}>
          <Text style={{ color: 'white' }}>{cancha.name.toUpperCase()}</Text>
        </View>
        <View style={[Styles.flexRow, styles.itemContainer, { backgroundColor: '#eeeeee', paddingBottom: 10, paddingTop: 10 }]}>
          <View style={[Styles.flexColumn, { flex: 0.7, alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
            <View>
              <Text style={{ color: '#393e44', fontSize: 13, fontWeight: '600' }}>{cancha.address}</Text>
            </View>
            <View style={[Styles.flexRow, { marginTop: 10 }]}>
              <TouchableItem
                onPress={() => this.openModalMaps(cancha.address_lat, cancha.address_lng)}
              >
                <View style={[Styles.flexRow, { marginRight: 10 }]}>
                  <MaterialCommunityIcons name="google-maps" size={24} style={{ color: Colors.primary }} />
                  <Text style={{ color: '#393e44', fontSize: 12 }}>VER MAPA</Text>
                </View>
              </TouchableItem>
              <TouchableItem
                  onPress={() => Alert.alert(
                    'CONTACTO',
                    `${cancha.phone} / ${cancha.email}`,
                    [
                      { text: 'OK', onPress: () => console.log(cancha) },
                    ],
                    { cancelable: false },
                  )}
                >
                <View style={[Styles.flexRow, { marginRight: 10 }]}>
                  <MaterialCommunityIcons name="phone-in-talk" size={24} style={{ color: Colors.primary }} />
                  
                    <Text style={{ color: '#393e44', fontSize: 12 }}>CONTACTO</Text>
                </View>
              </TouchableItem>
            </View>


          </View>
          <View style={[{ flex: 0.3 }]}>
            <TouchableItem
              accessibilityComponentType="button"
              accessibilityTraits="button"
              delayPressIn={0}
              pressColor={Colors.primary}
              onPress={() => this.props.navigation.navigate('Match', { selectedCancha: cancha.id })}
              style={{ backgroundColor: Colors.primary, borderRadius: 2, paddingHorizontal: 6, paddingTop: 10, paddingBottom: 6 }}
            >
              <View>
                <Text style={[Styles.inputText, { color: 'white', textAlign: 'center', fontSize: 14 }]}>A JUGAR</Text>
              </View>
            </TouchableItem>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { latitude, longitude } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Canchas"
        />
        <ScrollView keyboardShouldPersistTaps="never">
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={[Styles.centerContent, { marginBottom: 10 }]}>
            <Text style={Styles.title}>Canchas</Text>
          </View>
          <View style={Styles.flexColumn}>
            <View style={[Styles.flexRow, { borderWidth: 1, borderColor: '#efedf0', borderRadius: 5, paddingHorizontal: 5, paddingBottom: 2 }]}>
              <TextInput
                multiline={!commonFunc.isAndroid}
                numberOfLines={1}
                style={[{ height: 40, width: 220 }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                placeholder="Buscar Cancha"
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
              />
              <TouchableHighlight
                onPress={() => this.searchCanchas(this.state.name)}
              >
                <Image
                  source={require('../../assets/lupabtn.png')} style={{ width: 40,
                    height: 40,
                    borderRadius: 5,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5 }}
                />
              </TouchableHighlight>
            </View>
          </View>
          <View style={[Styles.flexRow, { backgroundColor: '#eeeeee', paddingHorizontal: 10, marginVertical: 10, paddingTop: 4, paddingBottom: 5, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={[{ color: '#393e44', fontSize: 14, marginBottom: 0 }]}>CANCHAS CERCA DE TU UBICACIÓN</Text>
          </View>
          <View style={Styles.flexColumn}>
            {this.renderCanchas()}
          </View>
          <ModalMaps
            latitude={latitude}
            longitude={longitude}
            onClose={this.closeModalMaps.bind(this)}
            isVisible={this.state.modalMaps}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    width: Metrics.screenWidth,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
});


export default SearchCanchasScreen;
