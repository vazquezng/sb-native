import { LOGIN } from './types';

export const login = (profile) => (dispatch) => {

  dispatch({ type: LOGIN, profile });
};

export const saveProfile = (profile) => (dispatch) => {

  dispatch({ type: LOGIN, profile });
};
