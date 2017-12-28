import { combineReducers } from 'redux';

import user from './user/';
import news from './news/';
import screen from './screen/';

const reducers = {
  user,
  news,
  screen,
};

const mainReducer = combineReducers(reducers);

export default mainReducer;
