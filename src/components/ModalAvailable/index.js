import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import TouchableItem from '../TouchableItem';
import ModalHOC from '../Modal';
import styles from './styles';

const ModalAvailableHOC = () => (WrappedComponent) => {
  @ModalHOC()
  class ModalAvailable extends WrappedComponent {

    handleSuccess = () => {
      this.props.onSuccess(this.state);
    }

    render() {
      const { title, clearText, onClear, onClose, successText } = this.props;

      return (
        <View style={styles.modalFiltroContainer}>
          <View style={styles.modalFiltroHeader}>
            <View style={styles.modalFiltroHeaderIconContainer}>
              {
                (clearText && onClear) && (
                  <TouchableOpacity
                    onPress={onClear}
                    style={styles.modalFiltroClearContainer}
                  >
                    <Text style={styles.modalFiltroClearText}>
                      {clearText}
                    </Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
          <TouchableItem
            onPress={this.handleSuccess}
            pressColor={'white'}
            delayPressIn={0}
            style={styles.modalFiltroSuccessContainer}
          >
            <View pointerEvents="box-only" style={styles.modalFiltroSucccess}>
              <Text style={styles.modalFiltroSucccessText}>
                GUARDAR
              </Text>
            </View>
          </TouchableItem>
        </View>
      );
    }
  }

  return ModalAvailable;
};

export default ModalAvailableHOC;
