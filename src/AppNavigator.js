/* eslint-disable react/prop-types,react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import AuthNavigationDrawer from './AuthNavigationDrawer';

class AppNavigator extends Component {
  state = {
    loaded: true,
  };

  shouldComponentUpdate(nextProps) {
    if (this.props.renderAuth !== nextProps.renderAuth) {
      this.setState({ loaded: false });
      return true;
    }

    return false;
  }

  render() {
    const AppNavigatorDrawerContainer = AuthNavigationDrawer('es_ar');
    return (
      <AppNavigatorDrawerContainer />
    );
  }

}
const mapStateToProps = state => ({
  user: state.user,
});
const AppWithNavigationState = connect(mapStateToProps)(AppNavigator);

export default AppWithNavigationState;
