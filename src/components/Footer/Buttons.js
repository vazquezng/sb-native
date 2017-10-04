import React from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import Styles from '@theme/Styles';
import Colors from '@theme/Colors';

const Buttons = props => (
  <View style={[Styles.flexRow, { backgroundColor: '#414142', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderBottomWidth: 4, borderColor: Colors.primary }]}>
    <TouchableHighlight
      onPress={() => props.navigate('SearchUsers')}
      style={[Styles.flexColumn, { justifyContent: 'center', alignItems: 'center', flex: 0.35 }]}
    >
      <View style={[Styles.flexColumn, { justifyContent: 'space-between', alignItems: 'center' }]}>
        <Image
          source={require('../../assets/BuscarJugadores.png')}
          style={{ width: 24, height: 24 }}
        />
        <Text style={{ color: 'white', fontSize: 10 }}>BUSCAR JUGADORES</Text>
      </View>
    </TouchableHighlight>
    <View style={[Styles.flexColumn, { justifyContent: 'center', alignItems: 'center', flex: 0.3, borderRightWidth: 1, borderLeftWidth: 1, borderColor: '#2d2d2e' }]}>
      <Image
        source={require('../../assets/btHome.png')}
        style={{ width: 78, height: 78 }}
      />
    </View>
    <TouchableHighlight
      onPress={() => props.navigate('Match')}
      style={[Styles.flexColumn, { justifyContent: 'center', alignItems: 'center', flex: 0.35 }]}
    >
      <View style={[Styles.flexColumn, { justifyContent: 'center', alignItems: 'center' }]}>
        <Image
          source={require('../../assets/CrearPartido.png')}
          style={{ width: 30, height: 25 }}
        />
        <Text style={{ color: 'white', fontSize: 10 }}>CREAR PARTIDO</Text>
      </View>
    </TouchableHighlight>
  </View>
);

export default Buttons;
