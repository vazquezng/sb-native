import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableHighlight } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ModalPicker from './components/ModalPicker';

export default class Picker extends React.Component {
  static propTypes = {
    selectedValue: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onSelectValue: PropTypes.func.isRequired,
    hasArrow: PropTypes.bool,
  }

  static defaultProps = {
    hasArrow: false,
  }

  state = {
    isModalVisible: false,
  }

  onValueSelected = (rowData) => {
    this.closeModal();
    this.props.onSelectValue(rowData);
  }

  closeModal = () => this.setState({ isModalVisible: false });

  openModal = () => this.setState({ isModalVisible: true });

  render() {
    const { isModalVisible } = this.state;
    const { selectedValue, placeholder, containerStyle, textStyle, list, hasArrow } = this.props;

    return (
      <View style={containerStyle}>
        <TouchableHighlight
          style={this.props.buttonStyle}
          onPress={() => this.openModal()}
          underlayColor="transparent"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={textStyle}>
              { selectedValue || placeholder }
            </Text>
            {
              hasArrow && (
                <MaterialIcons
                  size={20}
                  name="arrow-drop-down"
                  style={{ color: 'white' }}
                />
              )
            }
          </View>
        </TouchableHighlight>
        <ModalPicker
          onClose={this.closeModal}
          isVisible={isModalVisible}
          onSelectValue={this.onValueSelected}
          list={list}
        />
      </View>
    );
  }
}
