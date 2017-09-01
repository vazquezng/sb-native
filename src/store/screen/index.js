const MAIN = 'Screen/MAIN';
const NOTMAIN = 'Screen/NotMain';

export const setScreenMain = main => (dispatch) => {
  dispatch({ type: main ? MAIN : NOTMAIN });
};

const INITIAL_STATE = {
  main: true,
};

export default function UserStateReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case MAIN :
      return { ...state, main: true };
    case NOTMAIN:
      return { ...state, main: false };
    default:
      return state;
  }
}
