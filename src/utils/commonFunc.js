import React, { Component } from 'react';
import {
  Platform,
  Image,
  Modal,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import SpinnerIOS from 'react-native-spinkit';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

const fontRegular = Platform.OS === 'ios' ? 'Cookie' : 'CookieRegular';
const fontRobotoLight = Platform.OS === 'ios' ? 'OpenSans' : 'RobotoLight';

const commonFunc = {
  renderSpinner: (visible) => {
    console.log(visible);
    if (!visible || Platform.OS === 'ios') {
      return null;
    }

    if (Platform.OS === 'android') {
      return (<Spinner visible={visible} />);
    } else {
      return (
        <Modal
          animationType="fade"
          hardwareAccelerated
          transparent
          visible={visible}
          supportedOrientations={['portrait', 'landscape']}
          style={{ flex: 1, backgroundColor: 'rgb(0,0,0)'}}
          >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0, 0.5)', height: Styles.screenHeight, width: Styles.screenWidth }}>
            <View style={[Styles.flexColumn, { justifyContent: 'center', alignItems: 'center' }]}>
              <SpinnerIOS isVisible={visible} size={30} type="Circle" color={Colors.primary} style={{ marginTop: Metrics.screenHeight / 2 }} />
            </View>
          </View>
        </Modal>
      );
    }
  },

  isFunction: (functionToCheck) => {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  },
  renderImageProfile: (image, dimension) => {
    const imageURI = image || 'http://web.slambow.com/img/profile/profile-blank.png';
    return (
      <Image
        source={{ uri: imageURI }} style={{ width: dimension,
          height: dimension,
          borderRadius: (dimension / 2),
          borderTopLeftRadius: (dimension / 2),
          borderTopRightRadius: (dimension / 2),
          borderBottomLeftRadius: (dimension / 2),
          borderBottomRightRadius: (dimension / 2) }}
      />
    );
  },
  pickerGameLevel: [
    { label: '2.5', value: '2.5' },
    { label: '3.0', value: '3' },
    { label: '3.5', value: '3.5' },
    { label: '4.0', value: '4' },
    { label: '4.5', value: '4.5' },
    { label: '5.0', value: '5' },
    { label: '5.5', value: '5.5' },
    { label: '6.0', value: '6' },
    { label: '6.5', value: '6.5' },
    { label: '7.0', value: '7' },
  ],
  pickerSexo: [{ label: 'Mixto', value: 'mixto' }, { label: 'Masculino', value: 'male' }, { label: 'Femenino', value: 'female' }],
  fontRegular,
  fontRobotoLight,
  isAndroid: Platform.OS === 'android',
};

export default commonFunc;
