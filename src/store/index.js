import { createStore, compose, applyMiddleware } from 'redux';
import { autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';

import firebase from 'firebase';

import firebaseConfig from './firebase.json';
import reducer from './reducer';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const middleware = applyMiddleware(thunk.withExtraArgument(firebaseApp));

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  middleware,
  autoRehydrate(),
);

const store = createStore(
  reducer,
  enhancer,
);

export default store;
