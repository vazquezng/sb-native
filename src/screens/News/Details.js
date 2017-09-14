import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  ScrollView,
  Text,
} from 'react-native';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const mapStateToProps = state => ({
  user: state.user,
});

@connect(mapStateToProps)
class NewsDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'News Details',
    headerLeft: (
      <HeaderButton
        icon="menu"
        onPress={() => navigation.navigate('DrawerOpen')}
        tintColor={'white'}
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
    fetch(`${API}/match`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.user.profile.token}`,
      },
    })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          matchs: responseJson.matchs,
        });
      });
  }

  renderNews() {
    return (
      <View>
        <Image style={[Styles.flexColumn, { backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'flex-start', paddingBottom: 10, paddingHorizontal: 5 }]} source={require('../../assets/news1.png')} />
        <View style={[Styles.flexRow, { backgroundColor: Colors.primary, paddingHorizontal: 10, marginVertical: 1, paddingTop: 4, paddingBottom: 5, justifyContent: 'flex-start', alignItems: 'center'}]}>
          <Text style={{ color: 'white', flex: 1 }}>JULIO 22.2017</Text>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 5, paddingBottom: 5 }}>
          <View style={{ marginTop: 5, marginBottom: 10, paddingBottom: 5, borderBottomWidth: 1, borderColor: '#d8d8d8'}}>
            <Text style={{ color: Colors.primary, fontSize: 22 }}>ARRANCA EL ATP</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              {'\n'}{'\n'}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              {'\n'}{'\n'}
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              {'\n'}{'\n'}
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            </Text>
          </View>
        </View>
      </View>

    );
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="keyboard-arrow-left"
          onPress={() => navigation.navigate('Home')}
          title="Detalle Noticia"
        />
        <ScrollView keyboardShouldPersistTaps={'never'}>
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View>
            {this.renderNews()}
          </View>
        </ScrollView>
      </View>
    );
  }
}


export default NewsDetailScreen;
