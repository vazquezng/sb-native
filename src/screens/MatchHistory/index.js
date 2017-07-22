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

class MatchHistoryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Mis Partidos',
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

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1}}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Mis Partidos"
        />
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          <Spinner visible={this.state.spinnerVisible} />
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={Styles.title}>Mis Partidos</Text>
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


export default MatchHistoryScreen;
