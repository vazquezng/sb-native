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
      <View style={[Styles.flexColumn, { borderColor: Colors.second, borderWidth: 0.8, borderRadius: 50, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10 }]}>
        <TouchableItem
          onPress={() => this.props.navigation.navigate('ViewPlayer', { user: player.id, backName: 'SuggestedPlayers', backParams: { match: this.props.navigation.state.params.match } })}
        >
          <View style={{ marginBottom: 10 }}>
            <Image
              source={{ uri: imageURI }} style={{ width: 160,
                height: 160,
                borderRadius: 80,
                borderTopLeftRadius: 100,
                borderTopRightRadius: 100,
                borderBottomLeftRadius: 100,
                borderBottomRightRadius: 100 }}
            />
          </View>
        </TouchableItem>
        <View style={{ backgroundColor: 'rgba(204, 204, 208, 0.3)', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 5, width: 100, marginBottom: 10 }}>
          <Text style={{ color: Colors.primary, textAlign: 'center' }}>{player.first_name}</Text>
          <Text style={{ textAlign: 'center' }}>{player.last_name}</Text>
        </View>
        <View style={{ backgroundColor: 'rgba(204, 204, 208, 0.3)', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 5, width: 100, marginBottom: 10 }}>
          <Text style={{ color: Colors.primary, textAlign: 'center' }}>Nivel</Text>
          <Text style={{ textAlign: 'center' }}>{player.game_level}</Text>
        </View>
        <View style={[Styles.flexRow, { justifyContent: 'space-between', flex: 1 }]}>
          <TouchableItem onPress={() => this.props.clearUser()} style={{ marginRight: 10 }}>
            <Entypo name="circle-with-cross" size={30} style={{ color: '#dc1b1b' }}/>
          </TouchableItem>
          <TouchableItem
            onPress={() => this.props.navigation.navigate('ViewPlayer', { user: player.id, backName: 'SuggestedPlayers', backParams: { match: this.props.navigation.state.params.match } })}
          >
            <Entypo name="info-with-circle" size={24} style={{ color: Colors.primary }} />
          </TouchableItem>
          <TouchableItem onPress={() => this.props.invite(player.id)} style={{ marginLeft: 10 }}>
            <Entypo name="circle-with-plus" size={30} style={{ color: '#729e44' }} />
          </TouchableItem>
        </View>
      </View>
    );
  }
}

export default Card;
