import { createStore } from 'redux';
import rootReducer from './reducers';

export const store = createStore(rootReducer);

export const setUserTokenAct = token => ({
  type: 'SET_USER_TOKEN',
  token
})

export const setUserInfoAct = info => ({
  type: 'SET_USER_INFO',
  info
})

export const clearUserAct = () => ({
  type: 'CLEAR_USER'
})