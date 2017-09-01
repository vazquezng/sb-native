import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import Styles from '@theme/Styles';

class NoMoreCards extends Component {

  render() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', selfAlign: 'center' }}>
        <Text style={[Styles.subtitle, { textAlign: 'center', selfAlign: 'center' }]}>No se encontraron usuarios con las especificaciones</Text>
      </View>
    );
  }
}

export default NoMoreCards;
