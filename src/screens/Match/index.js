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
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Entypo from 'react-native-vector-icons/Entypo';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';

const { width } = Dimensions.get('window');

const three = ( (width - 40) / 3) - 5;
const two = ( (width - 40) / 2) - 5;
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
      sexo: 'male',
      game_level: '2.5',
      distance: 2,
      club_member: '0',
    };
  }

  renderOtherClub() {
    if(this.state.club_member === '0') {
      return (
        <View>
          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <TextInput
                style={[Styles.input, { width: width - 50 }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
              />
              <Text style={Styles.inputText}>NOMBRE DEL CLUB</Text>
            </View>
          </View>
          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <TextInput
                style={[Styles.input, { width: width - 50 }]}
                placeholder="Indicar Dirección"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
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
    return (
      <View>
        <View style={{marginTop: 20}}>
          <Text style={{ color: Colors.primary, fontSize: 20}}>NIVEL DE JUEVO</Text>
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <View style={[styles.flexColumn]}>
            <Picker
              style={{ width: two, height: 33 }}
              selectedValue={this.state.game_level}
              onValueChange={(itemValue, itemIndex) => this.setState({ sexo: itemValue })}>
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
              selectedValue={this.state.game_level}
              onValueChange={(itemValue, itemIndex) => this.setState({ sexo: itemValue })}>
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
              selectedValue={this.state.sexo}
              onValueChange={(itemValue, itemIndex) => this.setState({ sexo: itemValue })}>
              <Picker.Item label="Mixto" value="mixto" />
              <Picker.Item label="Masculino" value="male" />
              <Picker.Item label="Femenino" value="female" />
            </Picker>
            <Text style={Styles.inputText}>SEXO</Text>
          </View>
          <View style={[styles.flexColumn]}>
            <Picker
              style={{ width: two, height: 33 }}
              selectedValue={this.state.sexo}
              onValueChange={(itemValue, itemIndex) => this.setState({ sexo: itemValue })}>
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
    return (
      <View>
        <View style={{marginTop: 20}}>
          <Text style={{ color: Colors.primary, fontSize: 20}}>EDAD</Text>
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <View style={[styles.flexColumn]}>
            <TextInput
              style={[Styles.input, { width: two }]}
              placeholder="EDAD"
              underlineColorAndroid={'transparent'}
              placeholderTextColor="lightgrey"
            />
            <Text style={Styles.inputText}>DESDE</Text>
          </View>
          <View style={[styles.flexColumn]}>
            <TextInput
              style={[Styles.input, { width: two }]}
              placeholder="EDAD"
              underlineColorAndroid={'transparent'}
              placeholderTextColor="lightgrey"
            />
            <Text style={Styles.inputText}>HASTA</Text>
          </View>
        </View>
      </View>
    );
  }

  save() {

  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1}}>
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
              <TextInput
                style={[Styles.input, { width: three }]}
                placeholder="FECHA"
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
              />
              <Text style={Styles.inputText}>FECHA</Text>
            </View>
            <View style={[styles.flexColumn]}>
              <TextInput
                placeholder="HORA"
                style={[Styles.input, { width: three }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
              />
              <Text style={Styles.inputText}>HORA</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn]}>
              <Picker
                style={{ width: width - 50, height: 33 }}
                selectedValue={this.state.club_member}
                onValueChange={(itemValue, itemIndex) => this.setState({ sexo: itemValue })}>
                <Picker.Item label="OTRA" value="0" />
              </Picker>
              <Text style={Styles.inputText}>SOS SOCIO DE ALGUN CLUB</Text>
            </View>
          </View>

          <View>
            {this.renderOtherClub()}
          </View>
          <View>
            {/* mapa */}
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
              onPress={this.save()}
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
});


export default MatchScreen;
