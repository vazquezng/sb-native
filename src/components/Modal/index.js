/* eslint-disable react/prop-types,react/prefer-stateless-function */
import React from 'react';
import { Modal } from 'react-native';

import styles from './styles';

const ModalHOC = () => WrappedComponent => (
  class ModalHOC extends React.PureComponent {
    render() {
      return (
        <Modal
          style={styles.bottomModal}
          hardwareAccelerated
          visible={this.props.isVisible}
          transparent
          onRequestClose={() => this.props.onClose()}
          supportedOrientations={['portrait', 'landscape']}
        >
          <WrappedComponent {...this.props} />
        </Modal>
      );
    }
  }
);

export default ModalHOC;
