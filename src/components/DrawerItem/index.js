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
          <Text style={{ fontSize: 16, color: '#00a5d7' }}>
          |  {label}
          </Text>
          :
          <Text style={{ fontSize: 16, color: '#FFFFFF' }}>
          |  {label}
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
