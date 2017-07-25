import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import ModalHOC from '../Modal';
import styles from './styles';

const ModalFullSHOC = () => (WrappedComponent) => {
  @ModalHOC()
  class ModalFullS extends WrappedComponent {

    handleSuccess = () => {
      this.props.onSuccess(this.state);
    }

    render() {
      const { title, onClose, successText } = this.props;

      return (
        <View style={styles.modalFiltroContainer}>
          <View style={styles.modalFiltroContent}>
            <TouchableOpacity
              style={{ paddingLeft: 20, paddingTop: 10, }}
              onPress={() => onClose()}
            >
              <SimpleLineIcons name="close" size={26} color="rgba(0,0,0,.8)" />
            </TouchableOpacity>
            {super.render()}
          </View>
        </View>
      );
    }
  }

  return ModalFullS;
};

export default ModalFullSHOC;
