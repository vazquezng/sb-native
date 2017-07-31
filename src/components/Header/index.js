/* @flow */

import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HeaderButton from '../HeaderButton';

import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

const paddingTop = (Platform.OS === 'ios') ? 10 : 0 ;

class Header extends React.PureComponent<DefaultProps, Props, State> {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
  };

  state = {};

  render() {
    const {
      iconName,
      onPress,
      title,
    } = this.props;

    return (
      <View style={{ height: 50, paddingTop, backgroundColor: '#ffffff', borderColor: '#b2b2b2', borderBottomWidth: 0.8 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          <View style={{flex: 0.3}}>
            <HeaderButton
              icon={iconName}
              onPress={onPress}
              tintColor={Colors.primary}
              title={title}
              truncatedTitle={title}
            />
          </View>
          <View style={{flex: 0.7}}>
            <Image source={require('../../assets/logo-header.png')}/>
          </View>
        </View>
      </View>
    );
  }
}


export default Header;
