import React from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// import LinearGradient from 'react-native-linear-gradient';
import { View, Text, TouchableHighlight } from 'react-native';
// import i18next from 'i18next';
import styles from './styles';
import Colors from '@theme/Colors';

const FloatingFilterButton = props => (
  <View colors={['transparent', 'rgba(0,0,0,0.2)']} style={{ width: '100%', height: 125, bottom: 0, position: 'absolute' }}>
    <TouchableHighlight
      style={styles.filterButton}
      onPress={() => props.onFilterPress()}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <SimpleLineIcons name="equalizer" size={18} style={{ color: Colors.primary, fontWeight: '900', marginLeft: 10, marginRight: 10, transform: [{ rotate: '90deg' }] }} />
        <Text style={{ marginRight: 10, color: Colors.primary, fontWeight: '600', fontSize: 11 }}>Filtros</Text>
      </View>
    </TouchableHighlight>
  </View>
);

export default FloatingFilterButton;
