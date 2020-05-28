import { combineReducers } from 'redux';

const signedInUserRdr = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER_TOKEN':
      return { token: action.token, info: state.info };
    case 'SET_USER_INFO':
      return { token: state.token, info: action.info };
    case 'CLEAR_USER':
      return {};
    default:
      return state;
  }
}

export default combineReducers({
  signedInUserRdr
});