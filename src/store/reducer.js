import { combineReducers } from 'redux';

import user from './user/';

const reducers = {
  user,
};

const mainReducer = combineReducers(reducers);

export default mainReducer;
