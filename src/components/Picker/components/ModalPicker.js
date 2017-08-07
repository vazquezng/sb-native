import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, TouchableHighlight, Modal } from 'react-native';
import styles from '../styles';
import ListItem from './ListItem';

export default class ModalPicker extends Component {
  static propTypes = {
    onSelectValue: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  state = {
    list: [],
    selectedIndex: null,
  }

  componentWillMount() {
    const { list, selectedIndex } = this.props;

    this.setState({
      list,
      selectedIndex,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { list, selectedIndex } = nextProps;

    this.setState({
      list,
      selectedIndex,
    });
  }

  keyExtractor = item => item.label;

  renderRow = ({ item, index }) => (
    <ListItem
      rowData={item}
      rowID={index}
      selectedIndex={this.state.selectedIndex}
      onSelect={this.props.onSelectValue}
    />
  )

  render() {
    return (
      <Modal
        style={styles.bottomModal}
        hardwareAccelerated
        visible={this.props.isVisible}
        transparent
        onRequestClose={() => this.props.onClose()}
        supportedOrientations={['portrait']}
      >
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={this.props.onClose}
          style={styles.modalContainer}
          activeOpacity={0}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={this.state.list}
              renderItem={this.renderRow}
              keyExtractor={this.keyExtractor}
            />
          </View>
        </TouchableHighlight>
      </Modal>
    );
  }
}
