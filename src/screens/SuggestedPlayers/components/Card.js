import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import TouchableItem from '@components/TouchableItem';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';

class Card extends Component {

  render() {
    const player = this.props;
    //const { navigation } = this.props;
    const imageURI = player && player.image ? player.image : 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <View style={[Styles.flexColumn, { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10 }]}>
        <TouchableItem
          onPress={() => this.props.navigation.navigate('ViewPlayer', { user: player.id, backName: 'SuggestedPlayers', backParams: { match: this.props.navigation.state.params.match } })}
        >
          <View style={{ marginBottom: 10 }}>
            <Image
              source={{ uri: imageURI }} style={{ width: 200,
                height: 200,
                borderRadius: 100,
                borderTopLeftRadius: 140,
                borderTopRightRadius: 140,
                borderBottomLeftRadius: 140,
                borderBottomRightRadius: 140 }}
            />
          </View>
        </TouchableItem>
        <View style={Styles.flexRow}>
          <View>
            <View style={{ backgroundColor: 'white', paddingBottom: 5, marginBottom: 10, marginRight: 20, justifyContent: 'flex-start', alignItems: 'flex-start', borderBottomWidth: 1, borderColor: '#c9c9c9' }}>
              <Text style={{ color: Colors.primary, textAlign: 'center', marginBottom: 12, marginTop: 5 }}>{player.first_name.toUpperCase()} {player.last_name.toUpperCase()}</Text>
              <Text style={{ textAlign: 'center' }}>Edad: {player.years}</Text>
            </View>
          </View>
          <View>
            <View style={{ backgroundColor: 'transparent', marginTop: 7, paddingBottom: 5, marginBottom: 10, justifyContent: 'flex-start', alignItems: 'flex-start', borderBottomWidth: 1, borderColor: '#c9c9c9' }}>
              <Text style={{ color: Colors.primary, textAlign: 'center', marginBottom: 5 }}>RANKING 4.5</Text>
              <Image
                source={require('../../../assets/ranking-pelotitas.png')}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        <View style={[Styles.flexRow, { justifyContent: 'space-between', flex: 1 }]}>
          <TouchableItem onPress={() => this.props.clearUser()} style={{ marginRight: 10 }}>
            <Image
              source={require('../../../assets/btntinder-not.png')}
              resizeMode="contain"
              style={{ width: 88, height: 92 }}
            />
          </TouchableItem>
          <TouchableItem
            onPress={() => this.props.navigation.navigate('ViewPlayer', { user: player.id, backName: 'SuggestedPlayers', backParams: { match: this.props.navigation.state.params.match } })}
          >
            <Image
              source={require('../../../assets/btntinder-info.png')}
              resizeMode="contain"
              style={{ width: 65, height: 64 }}
            />
          </TouchableItem>
          <TouchableItem onPress={() => this.props.invite(player.id)} style={{ marginLeft: 10 }}>
            <Image
              source={require('../../../assets/btntinder-yes.png')}
              resizeMode="contain"
              style={{ width: 88, height: 92 }}
            />
          </TouchableItem>
        </View>
      </View>
    );
  }
}

export default Card;
