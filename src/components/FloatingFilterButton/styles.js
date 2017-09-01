import { StyleSheet } from 'react-native';

import Colors from '@theme/Colors';

module.exports = StyleSheet.create({
  filterButton: {
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: Colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    backgroundColor: 'white',
    width: 115,
    height: 35,
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
});
