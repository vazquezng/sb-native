import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
} from 'react-native';
import { connect } from 'react-redux';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import FooterButtons from '@components/Footer/Buttons';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const mapStateToProps = state => ({
  user: state.user,
});

@connect(mapStateToProps)
class RankingScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Ranking',
    headerLeft: (
      <HeaderButton
        icon="menu"
        onPress={() => navigation.navigate('DrawerOpen')}
        tintColor={'white'}
        title={'Ranking'}
        truncatedTitle={'Ranking'}
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
      ranking: { position: 0, points: 0 },
    };
  }

  componentWillMount() {
    this.setState({ spinnerVisible: true });

    fetch(`${API}/user/me/ranking`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.user.profile.token}`,
      },
    })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          ranking: responseJson.ranking,
          spinnerVisible: false,
        });
      });
  }

  getPelotitas(points, index) {
    if (Math.round(points) > index) {
      return require('../../assets/pelotita-llena.png');
    }
    return require('../../assets/pelotita-vacia.png');
  }

  render() {
    const { navigation } = this.props;
    const { ranking } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="menu"
          onPress={() => navigation.navigate('DrawerOpen')}
          title="Ranking"
        />
        <View style={{ marginTop: 10 }}>
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <Text style={Styles.title}>Ranking</Text>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={[Styles.flexRow, { borderColor: '#c9c9c9', borderBottomWidth: 1, height: 40 }]}>
              <View style={[Styles.flexRow, { flex: 0.5, justifyContent: 'flex-start', alignItems: 'center' }]}>
                <FontAwesome name="user-circle-o" size={26} color={Colors.primary} />
                <Text style={{ fontSize: 32, color: '#414142', marginLeft: 10 }}>{ranking.position}</Text>
              </View>
              <View style={[Styles.flexRow, { flex: 0.5, justifyContent: 'flex-end', alignItems: 'center' }]}>
                <SimpleLineIcons name="reload" size={26} color={Colors.primary} />
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={[Styles.flexRow, { justifyContent: 'center' }]}>
              <Text style={{ fontSize: 80, color: '#414142' }}>{ranking.points}</Text>
            </View>
            <View style={[Styles.flexRow, { justifyContent: 'space-around', marginTop: 30 }]}>
              {
                [1, 2, 3, 4, 5].map((v, k) => (
                  <Image key={k} source={this.getPelotitas(ranking.points, k)} style={{ width: 52, height: 51 }} />
                  ))
              }
            </View>
          </View>
        </View>
        {/* <FooterButtons navigate={navigation.navigate} /> */}
      </View>
    );
  }
}


export default RankingScreen;
