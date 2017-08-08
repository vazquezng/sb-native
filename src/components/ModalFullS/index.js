import React from 'react';
import { View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import TouchableItem from '@components/TouchableItem';

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
            <TouchableItem
              style={{ paddingLeft: 20, paddingTop: 10 }}
              onPress={() => onClose()}
              pressColor={'white'}
              delayPressIn={0}
            >
              <SimpleLineIcons name="close" size={26} color="rgba(0,0,0,.8)" />
            </TouchableItem>
            {super.render()}
          </View>
        </View>
      );
    }
  }

  return ModalFullS;
};

export default ModalFullSHOC;
