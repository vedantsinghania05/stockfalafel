import { Constants } from '../../constants';
import { store, setUserTokenAct, setUserInfoAct, clearUserAct } from '../actions';

// Map dispatch to props
export const signedInUserMdtp = (dispatch) => ({
  setUserToken: (token) => setUserToken(token),
  setUserInfo: (info) => dispatch(setUserInfoAct(info)),
  clearUser: () => clearUser()
});

// Map state to props
export const signedInUserMstp = (state) => ({
  userInfo: getUserInfo(state.signedInUserRdr),
  isSignedIn: isSignedIn(state.signedInUserRdr),
});

// Exported
export const getUserToken = () => {
  let user = store.getState().signedInUserRdr;

  let cookie = JSON.parse(localStorage.getItem(Constants.userTokenCookie));
  let memory = user && user.token ? user.token : undefined;

  if (cookie && !memory) {
    store.dispatch(setUserTokenAct(cookie));
    return cookie;

  } else if (memory && !cookie) {
    localStorage.setItem(Constants.userTokenCookie, JSON.stringify(memory));
    return memory;

  } else if (cookie && memory) {
    if (JSON.stringify(cookie) !== JSON.stringify(memory))
      store.dispatch(setUserTokenAct(cookie));
    return cookie;

  } else {
    return undefined;
  }
}

// Dispatch methods
const setUserToken = (token) => {
  if (!token) return;
  localStorage.setItem(Constants.userTokenCookie, JSON.stringify(token));
  store.dispatch(setUserTokenAct(token));
}

const clearUser = () => {
  store.dispatch(clearUserAct());
  localStorage.removeItem(Constants.userTokenCookie);
}

// State methods
const isUserToken = user =>
  user && user.token ? true : false;

const getUserInfo = user =>
  user && user.info ? user.info : undefined;

const isUserInfo = user =>
  user && user.info && Object.keys(user.info).length > 0 ? true : false;  

const isSignedIn = user =>
  isUserToken(user) && isUserInfo(user) ? true : false;
