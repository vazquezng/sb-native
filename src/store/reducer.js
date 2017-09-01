import { combineReducers } from 'redux';

import user from './user/';
import screen from './screen/';

const reducers = {
  user,
  screen,
};

const mainReducer = combineReducers(reducers);

export default mainReducer;
