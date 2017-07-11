const INITIAL_STATE = {
  isAuth: false,
  token: null,
  username: null,
  user_id: null,
  achs: null,
  apex_account: null,
  profile: null,
  dashboard: null,
  error: '',
};

export default function UserStateReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}
