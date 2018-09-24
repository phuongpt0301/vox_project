import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_FAIL,
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_FAIL,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  NAME_CHANGED,
  PHONE_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  REGISTER_USER,
  REGISTER_USER_FAIL,
  LOGOUT
} from '../constants/Types';

const INITIAL_STATE = {
  email: '',
  password: '',
  fullName: '',
  phone: '',
  user: null,
  error: '',
  loading: false,
  image: '',
  Islogin:false,
  fbToken: null,
  gToken: null
};

export default function(state = {}, action) {
  switch (action.type) {
    case FACEBOOK_LOGIN_SUCCESS:
      return { fbToken: action.payload };
    case FACEBOOK_LOGIN_FAIL:
      return { fbToken: null };
    case GOOGLE_LOGIN_SUCCESS:
      return { gToken: action.payload };
    case GOOGLE_LOGIN_FAIL:
      return { gToken: null };
      case EMAIL_CHANGED:
        return { ...state, email: action.payload };
      case PASSWORD_CHANGED:
        return { ...state, password: action.payload };
      case NAME_CHANGED:
        return { ...state, fullName: action.payload };
      case PHONE_CHANGED:
        return { ...state, phone: action.payload };
      case LOGIN_USER:
        return { ...state,Islogin:false, error: '' };
        case LOGIN_USER_SUCCESS:
        return { ...state, ...INITIAL_STATE, user: action.payload };
      case LOGIN_USER_FAIL:
        return { ...state, error: 'Invalid email/password', password: '', loading: false };
      case REGISTER_USER:
        return { ...state, loading: true, error: '' };
      case REGISTER_USER_FAIL:
        return { ...state, error: 'Registration Failed', password: '', loading: false };
      case LOGOUT:
        return { ...state,Islogin:true}
    default:
      return state;
  }
}
