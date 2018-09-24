import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import UserRankReducer from './UserRankReducer';
import DuelReducer from './DuelReducer';


export default combineReducers({
  AuthReducer,
  UserRankReducer,
  DuelReducer
});
