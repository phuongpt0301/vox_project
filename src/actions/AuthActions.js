import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_FAIL,
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_FAIL,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  PHONE_CHANGED,
  NAME_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  REGISTER_USER,
  REGISTER_USER_FAIL,
  LOGOUT
} from '../constants/Types';

import { AsyncStorage } from 'react-native';




export const loginUser = () => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });

  };
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch({ type: LOGOUT });

   
};
};






  /*
Google
ios Client ID: 363240785520-uru4rm8es70obe1056im7q4vds9ipk7k.apps.googleusercontent.com
android Client ID: 363240785520-gbsmb4i93qmo5ictu7ste83199tkpven.apps.googleusercontent.com
  */
