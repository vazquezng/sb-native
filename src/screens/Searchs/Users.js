import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

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
      spinnerVisible: false,
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
    if (params && params.name) {
      this.searchUser(params.name);
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


  searchUser(name) {
    if (name !== '') {
      const { user } = this.props;
      this.setState({ name });

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
      <View key={key} style={[Styles.flexRow, styles.itemContainer]}>
        <View>
          {this.renderImage(user)}
        </View>
        <View style={Styles.flexColumn}>
          <View>
            <Text style={{ color: Colors.primary }}>{user.name}</Text>
          </View>
          <View>
            <Text style={{ fontFamily: commonFunc.fontRegular, fontSize: 14, color: '#000000' }}>
              {user.date}
            </Text>
          </View>
          <TouchableItem
            onPress={() => this.props.navigation.navigate('ViewPlayer', { user: user.id, inviteMatch: true, backName: 'SearchUsers', backParams: { name: this.state.name, filters: this.state.filters } })}
          >
            <Image
              source={require('../../assets/play/eye-icon.png')}
              style={{ width: 30, height: 25 }}
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
        source={{ uri: imageURI }} style={{ width: 120,
          height: 120,
          borderRadius: 60,
          borderTopLeftRadius: 80,
          borderTopRightRadius: 80,
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80 }}
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
        <ScrollView style={Styles.containerPrimary} keyboardShouldPersistTaps="never">
          <View style={Styles.centerContent}>
            <Text style={Styles.title}>Busca Jugadores</Text>
          </View>
          <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }} >
            <TextInput
              multiline={!commonFunc.isAndroid}
              numberOfLines={1}
              underlineColorAndroid="transparent"
              placeholderTextColor="lightgrey"
              placeholder="Escriba el Nombre o Apellido"
              value={this.state.name}
              style={[Styles.input, Styles.inputText, { width: commonFunc.width }]}
              onChangeText={name => this.searchUser(name)}
            />
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
    width: Metrics.width,
    borderColor: Colors.primary,
    borderWidth: commonFunc.isAndroid ? 0.8 : StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 20,
  },
});


export default SearchUsersScreen;
