/* eslint-disable react/prop-types */

import React from 'react';
import { View, Alert, ScrollView, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import MapView from 'react-native-maps';

import ModalFullSHOC from '@components/ModalFullS';

import Styles from '@theme/Styles';
import Colors from '@theme/Colors';

const enhance = compose(
  ModalFullSHOC(),
);

@enhance
export default class ModalMaps extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: props.latitude,
        longitude: props.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [{
        latlng: {
          latitude: props.latitude,
          longitude: props.longitude,
        },
        title: '',
        description: '',
      }],
    };
  }

  componentWillMount() {
    this.setState({
      region: Object.assign(this.state.region, { latitude: this.props.latitude, longitude: this.props.longitude }),
      markers: Object.assign(this.state.markers, { latlng: { latitude: this.props.latitude, longitude: this.props.longitude } }),
    });
  }

  render() {
    // const { onSuccess } = this.props;
    return (
      <ScrollView style={{ flex: 1, paddingHorizontal: 5 }}>
        <View>
          <Text style={Styles.title}>Mapa</Text>
        </View>
        <View>
          <View style={{ flex: 1, height: 200}}>
            <MapView
              zoomEnabled={true}
              minZoomLevel={16}
              maxZoomLevel={20}
              style={styles.map}
              region={this.state.region}
              onRegionChange={this.onRegionChange}
            >
              {this.state.markers && this.state.markers.map((marker, index) => (
                <MapView.Marker
                  key={index}
                  coordinate={marker.latlng}
                  title={marker.title}
                  description={marker.description}
                />
              ))}
            </MapView>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
