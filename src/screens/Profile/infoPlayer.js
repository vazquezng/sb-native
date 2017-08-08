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

  renderInfoUser(profile) {
    if (profile) {
      const single = Boolean(profile.single);
      const double = Boolean(profile.double);
      const sexo = profile.sexo === 'male' ? 'Masculino' : 'Femenino';
      return (
        <View>
          <View style={[Styles.flexRow, { marginTop: 20 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <Text
                style={[Styles.inputDisabled, { width: two, height: 25 }]}
              >
                {profile.first_name}
              </Text>
              <Text style={Styles.inputText}>NOMBRE</Text>
            </View>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <Text
                style={[Styles.inputDisabled, { width: two, height: 25 }]}
              >
                {profile.last_name}
              </Text>
              <Text style={Styles.inputText}>APELLIDO</Text>
            </View>
          </View>
          <View style={[Styles.flexRow, { marginTop: 20 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <Text
                style={[Styles.inputDisabled, { width: Metrics.buttonWidth, height: 25 }]}
              >
                {profile.email}
              </Text>
              <Text style={Styles.inputText}>EMAIL</Text>
            </View>
          </View>

          <View style={[Styles.flexRow, { marginTop: 20 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <Text
                style={[Styles.inputDisabled, { width: two, height: 25 }]}
              >
                {profile.years}
              </Text>
              <Text style={Styles.inputText}>EDAD</Text>
            </View>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <Text
                style={[Styles.inputDisabled, { width: two, height: 25 }]}
              >
                {sexo}
              </Text>
              <Text style={Styles.inputText}>SEXO</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <Text
                style={[Styles.inputDisabled, { width: Metrics.buttonWidth, height: 50 }]}
              >
                {profile.address}
              </Text>
              <Text style={Styles.inputText}>DIRECCION</Text>
            </View>
          </View>

          <View style={[styles.flexRow, { marginTop: 20 }]}>
            <View style={[styles.flexColumn, Styles.flexAlignLeft]}>
              <Text
                style={[Styles.inputDisabled, { width: Metrics.buttonWidth, height: 25 }]}
              >
                {profile.game_level}
              </Text>
              <Text style={Styles.inputText}>NIVEL DE JUEGO</Text>
            </View>
          </View>

          <View style={[Styles.flexRow, { justifyContent: 'space-around', marginTop: 20 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <Switch
                onTintColor={Colors.primary}
                value={single}
                editable={false}
              />
              <Text style={Styles.inputText}>SINGLES</Text>
            </View>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <Switch
                onTintColor={Colors.primary}
                value={double}
                editable={false}
              />
              <Text style={Styles.inputText}>DOBLES</Text>
            </View>
          </View>
          <View style={[Styles.flexRow]}>
            <View style={[Styles.flexColumn, { flex: 1, width: width - 50 }]}>
              <Text
                style={[Styles.inputDisabled, { width: Metrics.buttonWidth, height: 25 }]}
              >
                {profile.distance}
              </Text>
              <Text style={Styles.inputText}>DISTANCIA PARA JUGAR UN PARTIDO</Text>
            </View>
          </View>

          <View style={[Styles.flexRow, { marginTop: 20, marginBottom: 40 }]}>
            <View style={[Styles.flexColumn, Styles.flexAlignLeft]}>
              <Text style={Styles.inputText}>SOBRE MI</Text>
              <TextInput
                multiline
                numberOfLines={4}
                style={[Styles.input, { height: 100, width: width - 50, borderWidth: 1 }]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                value={profile.about}
                editable={false}
              />
            </View>
          </View>
        </View>
      );
    }

    return null;
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
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={styles.centerContent}>
            <Text style={Styles.title}>Perfil del usuario</Text>
          </View>
          <View style={Styles.flexColumn}>
            {this.renderImage(profile)}
          </View>
          {this.renderInfoUser(profile)}
        </ScrollView>
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


export default ViewPlayerScreen;
