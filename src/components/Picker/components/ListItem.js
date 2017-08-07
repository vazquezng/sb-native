import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, Text } from 'react-native';
import TouchableItem from '../../TouchableItem/index';

import styles from '../styles';

const pressColorAndroid = 'rgba(0, 0, 0, .32)';

const ListItem = (props) => {
  const { rowData, rowID, selectedIndex } = props;
  const selected = selectedIndex === parseInt(rowID, 10);

  return (
    <TouchableItem
      accessibilityComponentType="button"
      accessibilityTraits="button"
      testID="airport-item"
      delayPressIn={0}
      pressColor={pressColorAndroid}
      underlayColor="transparent"
      onPress={() => props.onSelect(rowData)}
    >
      <View style={styles.itemRow}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>
            {rowData.label}
          </Text>
        </View>
        <View style={styles.itemIconContainer}>
          {
            selected && (
              <MaterialIcons
                name="check"
                size={28}
                style={{ marginRight: 10 }}
              />
            )
          }
        </View>
      </View>
    </TouchableItem>
  );
};


ListItem.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default ListItem;
