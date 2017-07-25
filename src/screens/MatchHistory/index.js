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
import Metrics from '@theme/Metrics';
import API from '@utils/api';


const mapStateToProps = state => ({
  user: state.user,
});

@connect(mapStateToProps)
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
      matches: [],
    };
  }

  componentWillMount() {
    fetch(`${API}/match/history`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.user.profile.token}`,
      }
    })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        matches: responseJson.matches.reverse()
      });
    });
  }

  renderNoMatches(matches) {
    if (matches.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Text style={Styles.subtitle}>Aún no tienes partidos.</Text>
        </View>
      );
    }
    return null;
  }

  renderMatches(matches) {
    if (matches.length > 0) {
      return (
        <View style={styles.flexColumn}>
          {matches.map((m, k) => {
            return this.renderMatch(m, k)
          })}
        </View>
      );
    }
    return null;
  }

  renderMatch(match, key) {
    return (
      <View key={key} style={[styles.flexRow, styles.matchContainer, match.futureMatch ? styles.futureMatch : {} ]}>
        <View>
          <Text style={{ fontFamily: 'Roboto-Light'}}>{match.club_name}</Text>
        </View>
        <View>
          <Text style={{ color: Colors.primary}}>|</Text>
        </View>
        <View>
          <Text style={{ fontFamily: 'Cookie-Regular', fontSize: 14, color: '#000000'}}>
            {match.date} - {match.hour}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('MatchDetail', { match: match.id })}
        >
          <Image
            source={require('../../assets/play/eye-icon.png')}
            style={{ width: 30, height: 25}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { matches } = this.state;
    return (
      <View style={{ flex: 1}}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Mis Partidos"
        />
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="always">
          <Spinner visible={this.state.spinnerVisible} />
          <View style={styles.centerContent}>
            <Text style={Styles.title}>Mis Partidos</Text>
          </View>
          {this.renderNoMatches(matches)}
          {this.renderMatches(matches)}
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
    flex: 1,
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
  centerContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchContainer: {
    width: Metrics.buttonWidth,
    borderColor: Colors.primary,
    borderWidth: 0.8,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 20,
  },
  futureMatch: {
    backgroundColor: Colors.primary,
  },
});


export default MatchHistoryScreen;
