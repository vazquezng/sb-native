import React from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  View,
  ListView,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import fetchAbort from 'react-native-cancelable-fetch';
import Qs from 'qs';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../theme/Colors';
import Metrics from '../../theme/Metrics';

import TouchableItem from '../TouchableItem';


const WINDOW = Dimensions.get('window');
const defaultStyles = {
  container: {
    flex: 1,
    // marginLeft: Metrics.defaultMargin,
    // marginRight: Metrics.defaultMargin,
    // width: Metrics.screenWidth - Metrics.defaultMargin * 2,
    backgroundColor: 'transparent',
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    height: Metrics.defaultComponentHeight,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textInput: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    height: Metrics.defaultComponentHeight,
    width: Metrics.screenWidth - Metrics.defaultMargin * 2,
    borderRadius: 5,
    borderColor: '#D4D0D1',
    borderWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#d21f1f',
  },
  powered: {},
  listView: {
    marginHorizontal: 0,
    marginTop: 20,
  },
  currentLocationContainer: {
    width: Metrics.screenWidth - 10,
    height: 40,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginHorizontal: 0,
    marginTop: 7,
    borderBottomColor: '#AAA',
    borderBottomWidth: 1,
  },
  currentLocationText: {
  },
  row: {
    height: Metrics.defaultComponentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
  },
  description: {
  },
  loader: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  androidLoader: {
    marginRight: -15,
  },
};

const ds = new ListView.DataSource({
  rowHasChanged: function rowHasChanged(r1, r2) {
    if (typeof r1.isLoading !== 'undefined') {
      return true;
    }
    return r1 !== r2;
  },
});

const _results = [];
const _requests = [];

class GooglePlacesAutocomplete extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    underlineColorAndroid: PropTypes.string,
    onPress: PropTypes.func,
    onNotFound: PropTypes.func,
    onFail: PropTypes.func,
    minLength: PropTypes.number,
    fetchDetails: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoFillOnNotFound: PropTypes.bool,
    getDefaultValue: PropTypes.func,
    timeout: PropTypes.number,
    onTimeout: PropTypes.func,
    query: PropTypes.object,
    GoogleReverseGeocodingQuery: PropTypes.object,
    GooglePlacesSearchQuery: PropTypes.object,
    styles: PropTypes.object,
    textInputProps: PropTypes.object,
    enablePoweredByContainer: PropTypes.bool,
    predefinedPlaces: PropTypes.array,
    currentLocation: PropTypes.bool,
    currentLocationLabel: PropTypes.string,
    nearbyPlacesAPI: PropTypes.string,
    enableHighAccuracyLocation: PropTypes.bool,
    filterReverseGeocodingByTypes: PropTypes.array,
    predefinedPlacesAlwaysVisible: PropTypes.bool,
    enableEmptySections: PropTypes.bool,
    renderDescription: PropTypes.func,
    renderRow: PropTypes.func,
    renderLeftButton: PropTypes.func,
    locationButton: PropTypes.func,
    renderRightButton: PropTypes.func,
    listUnderlayColor: PropTypes.string,
  }

  static defaultProps = {
    placeholder: 'Search',
    placeholderTextColor: '#A8A8A8',
    underlineColorAndroid: 'transparent',
    onPress: () => {},
    onNotFound: () => {},
    onFail: () => {},
    minLength: 0,
    fetchDetails: false,
    autoFocus: false,
    autoFillOnNotFound: false,
    keyboardShouldPersistTaps: 'always',
    getDefaultValue: () => '',
    timeout: 20000,
    onTimeout: () => console.warn('google places autocomplete: request timeout'),
    query: {
      key: 'missing api key',
      language: 'en',
      types: 'geocode',
    },
    GoogleReverseGeocodingQuery: {},
    GooglePlacesSearchQuery: {
      rankby: 'distance',
      types: 'food',
    },
    styles: {},
    textInputProps: {},
    enablePoweredByContainer: true,
    predefinedPlaces: [],
    currentLocation: false,
    currentLocationLabel: 'Current location',
    nearbyPlacesAPI: 'GooglePlacesSearch',
    enableHighAccuracyLocation: true,
    filterReverseGeocodingByTypes: [],
    predefinedPlacesAlwaysVisible: false,
    enableEmptySections: true,
    listViewDisplayed: 'auto',
  }

  state = {
    text: this.props.defaultProps,
    dataSource: ds.cloneWithRows(this.buildRowsFromResults([])),
    listViewDisplayed: this.props.listViewDisplayed === 'auto' ? false : this.props.listViewDisplayed,
  };

  setAddressText(address) {
    this.setState({
      text: address,
    });
  }

  getAddressText() {
    return this.state.text;
  }

  buildRowsFromResults(results) {
    let res = null;
    if (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true) {
      res = [...this.props.predefinedPlaces];
      if (this.props.currentLocation === true) {
        res.unshift({
          description: this.props.currentLocationLabel,
          isCurrentLocation: true,
        });
      }
    } else {
      res = [];
    }
    res = res.map(place => ({
      ...place,
      isPredefinedPlace: true,
    }));
    return [...res, ...results];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.listViewDisplayed !== 'auto') {
      this.setState({
        listViewDisplayed: nextProps.listViewDisplayed,
      });
    }
  }

  componentWillUnmount() {
    this._abortRequests();
  }

  _abortRequests() {
    for (let i = 0; i < _requests.length; i++) {
      fetchAbort.abort(i);
    }
    _requests = [];
  }

  triggerFocus() {
    if (this.refs.textInput) this.refs.textInput.focus();
  }

  triggerBlur() {
    if (this.refs.textInput) this.refs.textInput.blur();
  }

  getCurrentLocation() {
    let options = null;
    if (this.props.enableHighAccuracyLocation) {
      options = (Platform.OS === 'android') ? {
        enableHighAccuracy: true,
        timeout: 20000,
      } : {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      };
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (this.props.nearbyPlacesAPI === 'None') {
          const currentLocation = {
            description: this.props.currentLocationLabel,
            geometry: {
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
          };
          this._disableRowLoaders();
          this.props.onPress(currentLocation, currentLocation);
        } else {
          this._requestNearby(position.coords.latitude, position.coords.longitude);
        }
      },
      (error) => {
        this._disableRowLoaders();
        alert(error.message);
      },
      options,
    );
  }

  onCurrentLocation() {
    this.setState({
      text: '',
    });
    this.triggerBlur(); // hide keyboard but not the results
    this._onBlur();
    this._disableRowLoaders();
    this.props.onCurrentLocationPress();
  }

  _getCurrentLocationView() {
    return (
      <View style={defaultStyles.currentLocationContainer}>
        <TouchableItem
          style={defaultStyles.currentLocationText}
          onPress={() => this.onCurrentLocation()}
        >
          <Text style={{ fontWeight: 'bold' }}>Set Current Location</Text>
        </TouchableItem>
      </View>
    );
  }

  _enableRowLoader(rowData) {
    const rows = this.buildRowsFromResults(_results);
    for (let i = 0; i < rows.length; i++) {
      if ((rows[i].place_id === rowData.place_id) || (rows[i].isCurrentLocation === true && rowData.isCurrentLocation === true)) {
        rows[i].isLoading = true;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rows),
        });
        break;
      }
    }
  }

  _disableRowLoaders() {
    for (let i = 0; i < _results.length; i++) {
      if (_results[i].isLoading === true) {
        _results[i].isLoading = false;
      }
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(_results)),
    });
  }

  _onPress(rowData) {
    if (rowData.isPredefinedPlace !== true && this.props.fetchDetails === true) {
      if (rowData.isLoading === true) {
        // already requesting
        return;
      }
      this._abortRequests();
      // display loader
      this._enableRowLoader(rowData);
      // fetch details
      _requests.push('fetchAbort');
      fetchAbort(`https://maps.googleapis.com/maps/api/place/details/json?${Qs.stringify({
        key: this.props.query.key,
        placeid: rowData.place_id,
        language: this.props.query.language,
      })}`, null, _requests.length).then((response) => {
        if (response.status === 200) {
          const responseJSON = JSON.parse(response._bodyInit);
          if (responseJSON.status === 'OK') {
            const details = responseJSON.result;
            this._disableRowLoaders();
            this._onBlur();

            this.setState({
              text: rowData.description,
            });
            delete rowData.isLoading;
            this.props.onPress(rowData, details);
          } else {
            this._disableRowLoaders();
            if (this.props.autoFillOnNotFound) {
              this.setState({
                text: rowData.description,
              });
              delete rowData.isLoading;
            }
            if (!this.props.onNotFound) { console.warn(`google places autocomplete: ${responseJSON.status}`); } else { this.props.onNotFound(responseJSON); }
          }
        } else {
          this._disableRowLoaders();

          if (!this.props.onFail) { console.warn('google places autocomplete: request could not be completed or has been aborted'); } else { this.props.onFail(); }
        }
      });
    } else if (rowData.isCurrentLocation === true) {
      this._enableRowLoader(rowData);
      this.setState({
        text: rowData.description,
      });
      this.triggerBlur(); // hide keyboard but not the results
      delete rowData.isLoading;
      this.getCurrentLocation();
    } else {
      this.setState({
        text: rowData.description,
      });
      this._onBlur();
      delete rowData.isLoading;
      const predefinedPlace = this._getPredefinedPlace(rowData);
      // sending predefinedPlace as details for predefined places
      this.props.onPress(predefinedPlace, predefinedPlace);
    }
  }

  _getPredefinedPlace(rowData) {
    if (rowData.isPredefinedPlace !== true) {
      return rowData;
    }
    for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
      if (this.props.predefinedPlaces[i].description === rowData.description) {
        return this.props.predefinedPlaces[i];
      }
    }
    return rowData;
  }

  _filterResultsByTypes(responseJSON, types) {
    if (types.length === 0) return responseJSON.results;

    const results = [];
    for (let i = 0; i < responseJSON.results.length; i++) {
      let found = false;
      for (let j = 0; j < types.length; j++) {
        if (responseJSON.results[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }
      if (found === true) {
        results.push(responseJSON.results[i]);
      }
    }
    return results;
  }

  _requestNearby(latitude, longitude) {
    this._abortRequests();
    if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
      let url = '';
      if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
        // your key must be allowed to use Google Maps Geocoding API
        url = `https://maps.googleapis.com/maps/api/geocode/json?${Qs.stringify({
          latlng: `${latitude}, ${ longitude}`,
          key: this.props.query.key,
          ...this.props.GoogleReverseGeocodingQuery,
        })}`;
      } else {
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${Qs.stringify({
          location: `${latitude}, ${ longitude}`,
          key: this.props.query.key,
          ...this.props.GooglePlacesSearchQuery,
        })}`;
      }
      _requests.push('fetchAbort');
      fetchAbort(url, null, _requests.length)
        .then((response) => {
          if (response.status === 200) {
            const responseJSON = JSON.parse(response._bodyInit);

            this._disableRowLoaders();

            if (typeof responseJSON.result !== 'undefined') {
              let results = [];
              if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                results = this._filterResultsByTypes(responseJSON, this.props.filterReverseGeocodingByTypes);
              } else {
                results = responseJSON.result;
              }

              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(results)),
              });
            }
            if (typeof responseJSON.error_message !== 'undefined') {
              console.warn(`google places autocomplete: ${responseJSON.error_message}`);
            }
          } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
          }
        });
    } else {
      _results = [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults([])),
      });
    }
  }

  _request(text) {
    this._abortRequests();
    if (text.length >= this.props.minLength) {
      _requests.push('fetchAbort');
      fetchAbort(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=${encodeURIComponent(text)}&${Qs.stringify(this.props.query)}`,
        null,
        _requests.length,
      )
        .then((response) => {
          if (response.status === 200) {
            const responseJSON = JSON.parse(response._bodyInit);
            if (typeof responseJSON.predictions !== 'undefined') {
              _results = responseJSON.predictions;
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(responseJSON.predictions)),
              });
            }
            if (typeof responseJSON.error_message !== 'undefined') {
              console.warn(`google places autocomplete: ${ responseJSON.error_message}`);
            }
          } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
          }
        });
    } else {
      _results = [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults([])),
      });
    }
  }

  _onChangeText(text) {
    this._request(text);
    this.setState({
      text,
      listViewDisplayed: true,
    });
  }

  _getRowLoader() {
    return (
      <ActivityIndicator
        animating
        size="small"
      />
    );
  }

  _renderRowData(rowData) {
    if (this.props.renderRow) {
      return this.props.renderRow(rowData);
    }

    return (
      <Text
        style={[
        { flex: 1, marginHorizontal: 0, width: Metrics.screenWidth - Metrics.defaultMargin * 2 },
        this.props.styles.description,
        rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
        numberOfLines={1}
      >
        {this._renderDescription(rowData)}
      </Text>
    );
  }

  _renderDescription(rowData) {
    if (this.props.renderDescription) {
      return this.props.renderDescription(rowData);
    }
    return rowData.description || rowData.formatted_address || rowData.name;
  }

  _renderLoader(rowData) {
    if (rowData.isLoading === true) {
      return (
        <View
          style={[defaultStyles.loader, this.props.styles.loader]}
        >
          {this._getRowLoader()}
        </View>
      );
    }
    return null;
  }

  _renderRow(rowData = {}, sectionID, rowID) {
    return (
      <View
        style={{ flex: 1, backgroundColor: 'transparent' }}
        keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableItem
          style={{ minWidth: WINDOW.width }}
          onPress={() => this._onPress(rowData)}
          underlayColor={this.props.listUnderlayColor || '#c8c7cc'}
        >
          <View style={[defaultStyles.row, this.props.styles.row, rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}]}>
            {this._renderRowData(rowData)}
            {this._renderLoader(rowData)}
          </View>
        </TouchableItem>
      </View>
    );
  }

  _renderSeparator(sectionID, rowID) {
    if (rowID == this.state.dataSource.getRowCount() - 1) {
      return null;
    }

    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={[defaultStyles.separator, this.props.styles.separator]}
      />
    );
  }

  _onBlur() {
    this.triggerBlur();
    this.setState({
      listViewDisplayed: false,
    });
  }

  _onFocus() {
    this.setState({
      listViewDisplayed: true,
    });
  }

  _shouldShowPoweredLogo() {
    if (!this.props.enablePoweredByContainer || this.state.dataSource.getRowCount() === 0) {
      return false;
    }
    for (let i = 0; i < this.state.dataSource.getRowCount(); i++) {
      const row = this.state.dataSource.getRowData(0, i);

      if (!row.hasOwnProperty('isCurrentLocation') && !row.hasOwnProperty('isPredefinedPlace')) {
        return true;
      }
    }
    return false;
  }

  _renderLeftButton() {
    if (this.props.renderLeftButton) {
      return this.props.renderLeftButton();
    }
  }

  _locationButton() {
    if (this.props.locationButton) {
      return this.props.locationButton();
    }
  }

  _renderRightButton() {
    if (this.props.renderRightButton) {
      return this.props.renderRightButton();
    }
  }

  _renderPoweredLogo() {
    if (!this._shouldShowPoweredLogo()) {
      return null;
    }
    // return (
    //   <View
    //       style={[defaultStyles.row, defaultStyles.poweredContainer, this.props.styles.poweredContainer]}
    //     >
    //       <Image
    //         style={[defaultStyles.powered, this.props.styles.powered]}
    //         resizeMode={Image.resizeMode.contain}
    //         source={require('../../../assets/images/powered_by_google_on_white.png')}
    //       />
    //     </View>
    // );
    return null;
  }

  _getListView() {
    if ((this.state.text !== '' || this.props.predefinedPlaces.length || this.props.currentLocation === true) && this.state.listViewDisplayed === true) {
      return (
        <ListView
          keyboardShouldPersistTaps
          keyboardDismissMode="on-drag"
          style={[defaultStyles.listView, this.props.styles.listView]}
          dataSource={this.state.dataSource}
          renderSeparator={this._renderSeparator.bind(this)}
          automaticallyAdjustContentInsets={false}
          {...this.props}
          renderRow={this._renderRow.bind(this)}
          renderFooter={this._renderPoweredLogo.bind(this)}
        />
      );
    }

    return null;
  }

  render() {
    const {
      onChangeText,
      onFocus,
      ...userProps
    } = this.props.textInputProps;
    return (
      <View style={[defaultStyles.container, this.props.styles.container]}>
        <View style={[defaultStyles.textInputContainer, this.props.styles.textInputContainer]}>
          {this._renderLeftButton()}
          <View style={[defaultStyles.textInput, this.props.styles.textInput]}>
            <Icon size={22} name="md-search" style={{ color: Colors.brandSecondary, width: 25 }} />
            <TextInput
              {...userProps}
              ref="textInput"
              autoFocus={this.props.autoFocus}
              onChangeText={onChangeText ? (text) => { this._onChangeText.bind(this, text); onChangeText(text); } : this._onChangeText.bind(this)}
              style={[{
fontSize: 20, flex: 1, marginHorizontal: 0, paddingBottom: Platform.OS === 'android' ? 5 : 0,
},
                this.props.styles.textInput]
              }
              value={this.state.text}
              placeholder={this.props.placeholder}
              placeholderTextColor={this.props.placeholderTextColor}
              onFocus={onFocus ? () => { this._onFocus.bind(this); onFocus(); } : this._onFocus.bind(this)}
              clearButtonMode="while-editing"
              underlineColorAndroid={this.props.underlineColorAndroid}
            />
            {this._locationButton()}
          </View>
          {this._renderRightButton()}
        </View>
        {this._getListView()}
        {this.props.children}
      </View>
    );
  }
}


export default GooglePlacesAutocomplete;
