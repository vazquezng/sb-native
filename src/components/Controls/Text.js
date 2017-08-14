import React from 'react';
import { View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import TouchableItem from '@components/TouchableItem';

import ModalHOC from '../Modal';
import styles from './styles';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

const ModalText = () => (WrappedComponent) => {
  @ModalHOC()
  class ModalTextS extends WrappedComponent {

    handleSuccess = () => {
      this.props.onSuccess(this.state);
    }

    render() {
      const { title, onClose, successText } = this.props;

      return (
        <View style={styles.modalFiltroContainer}>
          <View style={styles.modalFiltroContent}>
            {super.render()}
            <TouchableItem
              pointerEvents="box-only"
              accessibilityComponentType="button"
              accessibilityTraits="button"
              testID="profile-available"
              delayPressIn={0}
              style={Styles.btnSave}
              onPress={() => this.saveProfile()}
              pressColor={Colors.primary}
            >
              <View pointerEvents="box-only">
                <Text style={[Styles.inputText, { color: Colors.primary, textAlign: 'center'}]}>GUARDAR</Text>
              </View>
            </TouchableItem>
          </View>
        </View>
      );
    }
  }

  return ModalTextS;
};

export default ModalText;
