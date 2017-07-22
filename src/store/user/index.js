import { LOGIN } from './types.js';

const INITIAL_STATE = {
  isAuth: false,
  profile: null,
};

export default function UserStateReducer(state = INITIAL_STATE, action = {}) {
  const { profile } = action;

  switch (action.type) {
    case LOGIN :
      return { ...state, profile, isAuth: true };
    default:
      return state;
  }
}
