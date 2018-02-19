import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import firebase from 'firebase';
import rootReducer from './reducer';
import firebaseConfig from './firebase.json';

const isProduction = !__DEV__;

// Creating store
const storeConfig = {
  key: 'root', // key is required
  storage,
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const reducer = persistCombineReducers(storeConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
let enhancer = [];
let middleware = null;
if (isProduction) {
  // In production adding only thunk middleware
  middleware = applyMiddleware(thunk.withExtraArgument(firebaseApp));
} else {
  middleware = applyMiddleware(thunk.withExtraArgument(firebaseApp));
  enhancer = composeEnhancers(middleware);
}
const persistConfig = { enhancer };

const store = createStore(
  reducer,
  middleware,
);
const persistor = persistStore(store);

export { store, persistor, persistConfig };
