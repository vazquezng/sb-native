import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import { setScreenMain } from '@store/screen/';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';

import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const two = ( (Dimensions.get('window') - 40) / 2) - 5;
const fontRegular = Platform.OS === 'ios' ? 'Cookie' : 'CookieRegular';

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  onSetScreenMain: main => dispatch(setScreenMain(main)),
});

@connect(mapStateToProps, mapDispatchToProps)
class PlayScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Quiero Jugar',
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
      matchs: [],
    };
  }

  componentWillMount() {
    this.props.onSetScreenMain(false);

    fetch(`${API}/match`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.user.profile.token}`,
      }
    })
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({
        matchs: responseJson.matchs,
      });
    });
  }

  renderMatchs() {
    return this.state.matchs.map((match, key) => {
      return this.renderMatch(match, key);
    });
  }
  renderMatch(match, key) {
    return (
      <View key={key} style={[Styles.flexRow, { flex: 1, justifyContent: 'center', marginBottom: 1, borderBottomWidth: 0.8, paddingBottom: 10 }]}>
        <View style={{ width: two }}>
          {this.renderImage(match.user)}
        </View>
        <View style={{ width: two }}>
          {this.renderInfoMatch(match)}
        </View>
      </View>
    );
  }

  renderImage(user) {
    console.log(user);
    const imageURI = user && user.image ? user.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: 100,
          height: 100,
          borderRadius: 50,
          borderTopLeftRadius: 80,
          borderTopRightRadius: 80,
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80 }}
      />
    );
  }
  renderInfoMatch(match) {
    return (
      <View style={Styles.flexColumn}>
        <Text style={{ color: '#000000', fontSize: 18, borderColor: Colors.primary, borderBottomWidth: 1, paddingBottom: 2 }}>{match.user.first_name} {match.user.last_name}</Text>
        <Text style={{ color: Colors.primary, fontFamily: fontRegular, fontSize: 16 }}>{match.date} - {match.hour}</Text>
        <Text style={{ color: '#000000', fontSize: 12, borderColor: Colors.primary, borderBottomWidth: 1, paddingBottom: 2, marginTop: 10 }}>{match.club_name}</Text>
        <Text numberOfLines={1}>{match.address}</Text>
        <TouchableItem
          onPress={() => this.props.navigation.navigate('PlayMatch', { match: match.id })}
        >
          <Image
            source={require('../../assets/play/eye-icon.png')}
            style={{ width: 30, height: 25}}
          />
        </TouchableItem>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1}}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Quiero Jugar"
        />
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="never">
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={Styles.title}>Quiero Jugar</Text>
            <Text style={Styles.subTitle}>
              Aqui podras visualizar los partidos que fueron creados por otros usuarios, quienes cumplen
              "tus mismos requisitos" y están en la búsqueda de jugadores como vos.
            </Text>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require('../../assets/play/play.png')}
                style={{
                  aspectRatio: 8,
                  resizeMode: 'center',
                }}
              />
            </View>
          </View>
          <View>
            {this.renderMatchs()}
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


export default PlayScreen;
