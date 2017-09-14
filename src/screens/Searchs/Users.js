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
} from 'react-native';

import Header from '@components/Header';
import HeaderButton from '@components/HeaderButton';
import TouchableItem from '@components/TouchableItem';
import FloatingFilterButton from '@components/FloatingFilterButton';

import ModalFiltersUsers from './components/ModalFiltersUsers';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';
import API from '@utils/api';
import commonFunc from '@utils/commonFunc';

const mapStateToProps = state => ({
  user: state.user,
});
@connect(mapStateToProps)
class SearchUsersScreen extends Component {
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
      users: [],
      usersFilters: [],
      name: '',
      filters: {
        years_from: '18',
        years_to: '99',
        game_level_from: '2.5',
        game_level_to: '7',
        sexo: 'mixto',
      },
      filtersModal: false,
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

    if (params && params.filters) {
      this.setState({
        filters: params.filters,
      });
    } else {
      this.setState({
        filters: {
          years_from: '18',
          years_to: '99',
          game_level_from: '2.5',
          game_level_to: '7',
          sexo: 'mixto',
        },
      });
    }
  }

  searchFirstUser() {
    const { user } = this.props;

    fetch(`${API}/user/search/page`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.profile.token}`,
      },
    })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        users: responseJson.users,
        spinnerVisible: false,
      }, () => {
        this.setState({
          usersFilters: this.applyFilters(),
        });
      });
    });
  }

  searchUser(name) {
    if (name !== '') {
      const { user } = this.props;
      this.setState({ name, spinnerVisible: true });

      fetch(`${API}/user/${name}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.profile.token}`,
        },
      })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          users: responseJson.users,
          spinnerVisible: false,
        }, () => {
          this.setState({
            usersFilters: this.applyFilters(),
          });
        });
      });
    } else {
      this.setState({ name, users: [] });
    }
  }

  handleFilterPress = () => {
    console.log('openModal');
    this.setState({
      filtersModal: true,
    });
  };

  closeModalFilters = () => {
    this.setState({
      filtersModal: false,
    });
  }

  saveFilters(filters) {
    this.setState({
      filters,
    }, () => {
      this.setState({
        filtersModal: false,
        usersFilters: this.applyFilters(),
      });
    });
  }

  applyFilters() {
    const { users, filters } = this.state;
    return users.filter((u) => {
      if (filters.years_from > u.years || filters.years_to < u.years) {
        return false;
      }

      if (filters.game_level_from > u.game_level || filters.game_level_to < u.game_level) {
        return false;
      }

      if (filters.sexo !== 'mixto' && filters.sexo !== u.sexo) {
        return false;
      }

      return true;
    });
  }

  renderUsers() {
    return this.state.usersFilters.map((user, key) => this.renderUser(user, key));
  }

  renderUser(user, key) {
    return (
      <View key={key}>
        <View style={[Styles.flexRow, styles.itemContainer]}>
          <View style={{ flex: 3 }}>
            {this.renderImage(user)}
          </View>
          <View style={[Styles.flexColumn, { flex: 7, justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            <View>
              <Text style={{ color: Colors.primary }}>{user.name.toUpperCase()}</Text>
              <Text style={{ fontSize: 14, color: '#414143' }}>
                EDAD: {user.years}
              </Text>
              <Text style={{ fontSize: 14, color: '#414143' }}>
                NIVEL DEL JUEGO: {user.game_level}
              </Text>
            </View>
            {/* <View>
              <Text style={{ fontFamily: commonFunc.fontRegular, fontSize: 14, color: '#000000' }}>
                {user.date}
              </Text>
            </View> */}
          </View>
        </View>
        <View style={[Styles.flexRow, { backgroundColor: '#ededed', paddingRight: 10, paddingTop: 3, paddingBottom: 3, justifyContent: 'flex-end', alignItems: 'flex-end'}]}>
          <TouchableItem
            onPress={() => this.props.navigation.navigate('ViewPlayer', { user: user.id, inviteMatch: true, backName: 'SearchUsers', backParams: { name: this.state.name, filters: this.state.filters } })}
            style={[Styles.flexRow, { backgroundColor: Colors.primary, paddingRight: 5, borderRadius: 5 }]}
          >
            <Image
              source={require('../../assets/play/eye-icon.png')}
              style={{ width: 30, height: 25,  borderRadius: 5 }}
            />
          </TouchableItem>
        </View>
      </View>
    );
  }

  renderImage(profile) {
    const imageURI = profile && profile.image ? profile.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: 80,
          height: 80,
          borderRadius: 40,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20 }}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          iconName="menu"
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
          title="Buscar Jugadores"
        />
        <ScrollView keyboardShouldPersistTaps="never">
          {commonFunc.renderSpinner(this.state.spinnerVisible)}
          <View style={[Styles.centerContent, { marginBottom: 10 }]}>
            <Text style={Styles.title}>Jugadores</Text>
          </View>
          <View style={Styles.flexColumn}>
            <View style={[Styles.flexRow, { borderWidth: 1, borderColor: '#efedf0', borderRadius: 5, paddingHorizontal: 5, paddingBottom: 2 }]}>
              <TextInput
                multiline={!commonFunc.isAndroid}
                numberOfLines={1}
                style={[{ height: 40, width: 220}]}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="lightgrey"
                placeholder="Buscar Jugador"
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
              />
              <TouchableHighlight
                onPress={() => this.searchUser(this.state.name)}
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
          <View style={[Styles.flexRow, { backgroundColor: '#414143', paddingHorizontal: 10, marginVertical: 10, paddingTop: 4, paddingBottom: 5, justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={[Styles.title, { color: 'white', fontSize: 26, marginBottom: 0 }]}>Encontrá con quien jugar</Text>
          </View>
          <View style={Styles.flexColumn}>
            {this.renderUsers()}
          </View>
        </ScrollView>
          { this.state.users && this.state.users.length > 0 &&
            <FloatingFilterButton onFilterPress={this.handleFilterPress} />
          }

        <ModalFiltersUsers
          isVisible={this.state.filtersModal}
          filters={this.state.filters}
          onSuccess={this.saveFilters.bind(this)}
          onClose={this.closeModalFilters.bind(this)}
        />
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


export default SearchUsersScreen;
