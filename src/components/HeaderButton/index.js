/* @flow */

import React from 'react';
import {
  Text,
  View,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import TouchableItem from '../TouchableItem';
import styles from './styles';

type LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
  },
};

type Style =
  | { [key: string]: any }
  | number
  | false
  | null
  | void
  | Array<Style>;

type Props = {
  onPress?: () => void,
  pressColorAndroid?: ?string,
  icon?: ?string,
  title?: ?string,
  titleStyle?: ?Style,
  tintColor?: ?string,
  truncatedTitle?: ?string,
  width?: ?number,
};

type DefaultProps = {
  pressColorAndroid: ?string,
  tintColor: ?string,
  truncatedTitle: ?string,
};

type State = {
  initialTextWidth?: number,
};

class HeaderButton extends React.PureComponent<DefaultProps, Props, State> {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
  };

  state = {};

  onTextLayout = (e: LayoutEvent) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  render() {
    const {
      onPress,
      pressColorAndroid,
      width,
      title,
      titleStyle,
      tintColor,
      truncatedTitle,
      icon,
    } = this.props;

    const renderTruncated = this.state.initialTextWidth && width
      ? this.state.initialTextWidth > width
      : false;

    const backButtonTitle = renderTruncated ? truncatedTitle : title;
    const iconName = icon ? icon : 'arrow-back';
    let iconWithTitleStyle = title ? styles.iconWithTitle : {};
    iconWithTitleStyle = {}; // TODO: es necesario?

    return (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityLabel={backButtonTitle}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
      >
        <View style={styles.container}>
          <MaterialIcons
            name={iconName}
            style={[styles.icon, iconWithTitleStyle, { color: tintColor }]}
            size={24}
          />
          {/* {
            Platform.OS === 'ios' &&
              title &&
              <Text
                onLayout={this.onTextLayout}
                style={[styles.title, { color: tintColor }, titleStyle]}
                numberOfLines={1}
              >
                {backButtonTitle}
              </Text>
          } */}
        </View>
      </TouchableItem>
    );
  }
}


export default HeaderButton;
