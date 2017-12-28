import API from '@utils/api';

const NEWS = 'News/DATA';

export const fetchNews = () => (dispatch) => {
  fetch(`${API}/news`, {
    method: 'GET',
  }).then(response => response.json())
  .then((responseJson) => {
    dispatch({ type: NEWS, data: responseJson.news.reverse().filter(news => news.status === 1) });
  });
};

const INITIAL_STATE = {
  data: [],
  expired: null,
};

export default function NewsStateReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case NEWS :
      return { ...state, data: action.data };
    default:
      return state;
  }
}
