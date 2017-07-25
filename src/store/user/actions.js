import { LOGIN, LOGOUT } from './types';

export const login = (profile) => (dispatch) => {

  dispatch({ type: LOGIN, profile });
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

export const saveProfile = (profile) => (dispatch) => {

  dispatch({ type: LOGIN, profile });
};
