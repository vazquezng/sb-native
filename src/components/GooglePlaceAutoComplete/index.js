import React, {
  PropTypes
} from 'react';
import {
  TextInput,
  View,
  ListView,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Platform,
  ActivityIndicator,
  PixelRatio
} from 'react-native';
import Qs from 'qs';
import Icon from 'react-native-vector-icons/Ionicons';

import TouchableItem from '@components/TouchableItem';

import Colors from '@theme/Colors';
import Metrics from '@theme/Metrics';

const WINDOW = Dimensions.get('window');
const defaultStyles = {
  container: {
    marginLeft: 0,
    marginRight: 0,
    width: Metrics.screenWidth - Metrics.defaultMargin * 2,
    backgroundColor: 'transparent'
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
    borderColor: Colors.primary,
    borderBottomWidth: 1,
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
    backgroundColor: 'transparent'
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
const GooglePlacesAutocomplete = React.createClass({
  propTypes: {
    placeholder: React.PropTypes.string,
    placeholderTextColor: React.PropTypes.string,
    underlineColorAndroid: React.PropTypes.string,
    onPress: React.PropTypes.func,
    onNotFound: React.PropTypes.func,
    onFail: React.PropTypes.func,
    minLength: React.PropTypes.number,
    fetchDetails: React.PropTypes.bool,
    autoFocus: React.PropTypes.bool,
    autoFillOnNotFound: React.PropTypes.bool,
    getDefaultValue: React.PropTypes.func,
    timeout: React.PropTypes.number,
    onTimeout: React.PropTypes.func,
    query: React.PropTypes.object,
    GoogleReverseGeocodingQuery: React.PropTypes.object,
    GooglePlacesSearchQuery: React.PropTypes.object,
    styles: React.PropTypes.object,
    textInputProps: React.PropTypes.object,
    enablePoweredByContainer: React.PropTypes.bool,
    predefinedPlaces: React.PropTypes.array,
    currentLocation: React.PropTypes.bool,
    currentLocationLabel: React.PropTypes.string,
    nearbyPlacesAPI: React.PropTypes.string,
    enableHighAccuracyLocation: React.PropTypes.bool,
    filterReverseGeocodingByTypes: React.PropTypes.array,
    predefinedPlacesAlwaysVisible: React.PropTypes.bool,
    enableEmptySections: React.PropTypes.bool,
    renderDescription: React.PropTypes.func,
    renderRow: React.PropTypes.func,
    renderLeftButton: React.PropTypes.func,
    locationButton: React.PropTypes.func,
    renderRightButton: React.PropTypes.func,
    listUnderlayColor: React.PropTypes.string
  },
  getDefaultProps() {
    return {
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
      listViewDisplayed: 'auto'
    };
  },
  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: function rowHasChanged(r1, r2) {
        if (typeof r1.isLoading !== 'undefined') {
          return true;
        }
        return r1 !== r2;
      }
    });
    return {
      text: this.props.getDefaultValue(),
      dataSource: ds.cloneWithRows(this.buildRowsFromResults([])),
      listViewDisplayed: this.props.listViewDisplayed === 'auto' ? false : this.props.listViewDisplayed,
    };
  },
  setAddressText(address) {
    this.setState({
      text: address
    })
  },
  getAddressText() {
    return this.state.text
  },
  buildRowsFromResults(results) {
    var res = null;
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
    res = res.map(function(place) {
      return {
        ...place,
        isPredefinedPlace: true,
      }
    });
    return [...res, ...results];
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.listViewDisplayed !== 'auto') {
      this.setState({
        listViewDisplayed: nextProps.listViewDisplayed,
      });
    }
  },
  componentWillUnmount() {
    this._abortRequests();
  },
  _abortRequests() {
    for (let i = 0; i < this._requests.length; i++) {
      this._requests[i].abort();
    }
    this._requests = [];
  },
  triggerFocus() {
    if (this.refs.textInput) this.refs.textInput.focus();
  },
  triggerBlur() {
    if (this.refs.textInput) this.refs.textInput.blur();
  },
  getCurrentLocation() {
    let options = null;
    if (this.props.enableHighAccuracyLocation)
      options = (Platform.OS === 'android') ? {
        enableHighAccuracy: true,
        timeout: 20000
      } : {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (this.props.nearbyPlacesAPI === 'None') {
          let currentLocation = {
            description: this.props.currentLocationLabel,
            geometry: {
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }
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
      options
    );
  },
  onCurrentLocation() {
    this.setState({
      text: '',
    });
    this.triggerBlur(); // hide keyboard but not the results
    this._onBlur();
    this._disableRowLoaders();
    this.props.onCurrentLocationPress();
  },
  _getCurrentLocationView() {
    return (
      <View style={ defaultStyles.currentLocationContainer}>
        <TouchableItem
          style={defaultStyles.currentLocationText}
          onPress={() => this.onCurrentLocation()}
          pressColor={'transparent'}
          delayPressIn={0}
        >
          <Text style={{fontWeight: 'bold'}}>Set Current Location</Text>
        </TouchableItem>
      </View>
    );
  },
  _enableRowLoader(rowData) {
    let rows = this.buildRowsFromResults(this._results);
    for (let i = 0; i < rows.length; i++) {
      if ((rows[i].place_id === rowData.place_id) || (rows[i].isCurrentLocation === true && rowData.isCurrentLocation === true)) {
        rows[i].isLoading = true;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rows),
        });
        break;
      }
    }
  },
  _disableRowLoaders() {
    if (this.isMounted()) {
      for (let i = 0; i < this._results.length; i++) {
        if (this._results[i].isLoading === true) {
          this._results[i].isLoading = false;
        }
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(this._results)),
      });
    }
  },
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
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (responseJSON.status === 'OK') {
            if (this.isMounted()) {
              const details = responseJSON.result;
              this._disableRowLoaders();
              this._onBlur();

              this.setState({
                text: rowData.description,
              });
              delete rowData.isLoading;
              this.props.onPress(rowData, details);
            }
          } else {
            this._disableRowLoaders();
            if (this.props.autoFillOnNotFound) {
              this.setState({
                text: rowData.description,
              });
              delete rowData.isLoading;
            }
            if (!this.props.onNotFound)
              console.warn('google places autocomplete: ' + responseJSON.status);
            else
              this.props.onNotFound(responseJSON);
          }
        } else {
          this._disableRowLoaders();

          if (!this.props.onFail)
            console.warn('google places autocomplete: request could not be completed or has been aborted');
          else
            this.props.onFail();
        }
      };
      request.open('GET', 'https://maps.googleapis.com/maps/api/place/details/json?' + Qs.stringify({
        key: this.props.query.key,
        placeid: rowData.place_id,
        language: this.props.query.language,
      }));
      request.send();
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
      let predefinedPlace = this._getPredefinedPlace(rowData);
      // sending predefinedPlace as details for predefined places
      this.props.onPress(predefinedPlace, predefinedPlace);
    }
  },
  _results: [],
  _requests: [],
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
  },
  _filterResultsByTypes(responseJSON, types) {
    if (types.length === 0) return responseJSON.results;

    var results = [];
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
  },
  _requestNearby(latitude, longitude) {
    this._abortRequests();
    if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);

          this._disableRowLoaders();

          if (typeof responseJSON.results !== 'undefined') {
            if (this.isMounted()) {
              var results = [];
              if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                results = this._filterResultsByTypes(responseJSON, this.props.filterReverseGeocodingByTypes);
              } else {
                results = responseJSON.results;
              }

              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(results)),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            console.warn('google places autocomplete: ' + responseJSON.error_message);
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };

      let url = '';
      if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
        // your key must be allowed to use Google Maps Geocoding API
        url = 'https://maps.googleapis.com/maps/api/geocode/json?' + Qs.stringify({
          latlng: latitude + ',' + longitude,
          key: this.props.query.key,
          ...this.props.GoogleReverseGeocodingQuery,
        });
      } else {
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + Qs.stringify({
          location: latitude + ',' + longitude,
          key: this.props.query.key,
          ...this.props.GooglePlacesSearchQuery,
        });
      }

      request.open('GET', url);
      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults([])),
      });
    }
  },
  _request(text) {
    this._abortRequests();
    if (text.length >= this.props.minLength) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (typeof responseJSON.predictions !== 'undefined') {
            if (this.isMounted()) {
              this._results = responseJSON.predictions;
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults(responseJSON.predictions)),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            console.warn('google places autocomplete: ' + responseJSON.error_message);
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };
      request.open('GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=' + encodeURIComponent(text) + '&' + Qs.stringify(this.props.query));
      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.buildRowsFromResults([])),
      });
    }
  },
  _onChangeText(text) {
    this._request(text);
    this.setState({
      text: text,
      listViewDisplayed: true,
    });
  },
  _getRowLoader() {
    return (
      <ActivityIndicator
        animating={true}
        size="small"
      />
    );
  },
  _renderRowData(rowData) {
    if (this.props.renderRow) {
      return this.props.renderRow(rowData);
    }

    return (
      <Text style={[
        {flex: 1, marginHorizontal: 0, width: Metrics.screenWidth-Metrics.defaultMargin * 2},
        this.props.styles.description,
        rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
        numberOfLines={1}
      >
        {this._renderDescription(rowData)}
      </Text>
    );
  },
  _renderDescription(rowData) {
    if (this.props.renderDescription) {
      return this.props.renderDescription(rowData);
    }
    return rowData.description || rowData.formatted_address || rowData.name;
  },
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
  },
  _renderRow(rowData = {}, sectionID, rowID) {
    return (
      <View
        style={{ flex: 1, backgroundColor: 'transparent'}}
        keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TouchableHighlight
          style={{ minWidth: WINDOW.width }}
          onPress={() => this._onPress(rowData)}
          underlayColor={this.props.listUnderlayColor || "#c8c7cc"}
        >
          <View style={[defaultStyles.row, this.props.styles.row, rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}]}>
            {this._renderRowData(rowData)}
            {this._renderLoader(rowData)}
          </View>
        </TouchableHighlight>
      </View>
    );
  },
  _renderSeparator(sectionID, rowID) {
    if (rowID == this.state.dataSource.getRowCount() - 1) {
      return null
    }

    return (
      <View
        key={ `${sectionID}-${rowID}` }
        style={[defaultStyles.separator, this.props.styles.separator]} />
    );
  },
  _onBlur() {
    this.triggerBlur();
    this.setState({
      listViewDisplayed: false
    });
  },
  _onFocus() {
    this.setState({
      listViewDisplayed: true
    });
  },
  _shouldShowPoweredLogo() {
    if (!this.props.enablePoweredByContainer || this.state.dataSource.getRowCount() === 0) {
      return false
    }
    for (let i = 0; i < this.state.dataSource.getRowCount(); i++) {
      let row = this.state.dataSource.getRowData(0, i);

      if (!row.hasOwnProperty('isCurrentLocation') && !row.hasOwnProperty('isPredefinedPlace')) {
        return true
      }
    }
    return false
  },
  _renderLeftButton() {
    if (this.props.renderLeftButton) {
      return this.props.renderLeftButton()
    }
  },
  _locationButton() {
    if (this.props.locationButton) {
      return this.props.locationButton()
    }
  },
  _renderRightButton() {
      if (this.props.renderRightButton) {
        return this.props.renderRightButton()
      }
    },
  _renderPoweredLogo() {
    if (!this._shouldShowPoweredLogo()) {
      return null
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
  },
  _getListView() {
    if ((this.state.text !== '' || this.props.predefinedPlaces.length || this.props.currentLocation === true) && this.state.listViewDisplayed === true) {
      return (
        <ListView
          keyboardShouldPersistTaps={true}
          keyboardDismissMode="on-drag"
          style={[defaultStyles.listView, this.props.styles.listView]}
          dataSource={this.state.dataSource}
          renderSeparator={this._renderSeparator}
          automaticallyAdjustContentInsets={false}
          {...this.props}
          renderRow={this._renderRow}
          renderFooter={this._renderPoweredLogo}
        />
      );
    }

    return null;
  },
  render() {
    let {
      onChangeText,
      onFocus,
      ...userProps
    } = this.props.textInputProps;
    return (
      <View style={[defaultStyles.container, this.props.styles.container]}>
        <View style={[defaultStyles.textInputContainer, this.props.styles.textInputContainer]}>
          {this._renderLeftButton()}
          <View style={[defaultStyles.textInput, this.props.styles.textInput]}>
            <Icon size={22} name='md-search' style={{color: Colors.primary, width:25}}/>
            <TextInput
              { ...userProps }
              ref="textInput"
              autoFocus={this.props.autoFocus}
              onChangeText={onChangeText ? text => {this._onChangeText(text); onChangeText(text)} : this._onChangeText}
              style={[{fontSize: 16, flex: 1, marginHorizontal: 0, height: 70, paddingBottom: Platform.OS==='android' ? 5 : 0},
                this.props.styles.textInput]
              }
              value={this.state.text}
              placeholder={this.props.placeholder}
              placeholderTextColor={this.props.placeholderTextColor}
              onFocus={onFocus ? () => {this._onFocus(); onFocus();} : this._onFocus}
              clearButtonMode="while-editing"
              underlineColorAndroid={this.props.underlineColorAndroid}
              multiline={true}
              numberOfLines={4}
            />
          {this._locationButton()}
          </View>
          {this._renderRightButton()}
        </View>
        {this._getListView()}
        {this.props.children}
      </View>
    );
  },
});
const create = function create(options = {}) {
  return React.createClass({
    render() {
      return (
        <GooglePlacesAutocomplete ref="GooglePlacesAutocomplete"
          {...options}
        />
      );
    },
  });
};
module.exports = {
  GooglePlacesAutocomplete,
  create
};
