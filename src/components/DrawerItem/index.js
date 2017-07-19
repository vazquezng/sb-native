import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import styles from './styles';

const DrawerItem = ({ icon, label, focused, activeIcon }) => (
  <View style={styles.drawerItemContainer}>
    <View style={styles.drawerItemIconContainer}>
      { focused ? activeIcon : icon }
    </View>
    <View style={styles.drawerItemLabelContainer}>
      {
        focused ?
          <Text style={{ fontSize: 16, color: '#3F78C3' }}>
            {label}
          </Text>
          :
          <Text style={{ fontSize: 16, color: '#9b9b9b' }}>
            {label}
          </Text>
      }
    </View>
  </View>
);

DrawerItem.defaultProps = {
  focused: false,
};

DrawerItem.propTypes = {
  icon: PropTypes.element.isRequired,
  activeIcon: PropTypes.element.isRequired,
  focused: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

export default DrawerItem;
