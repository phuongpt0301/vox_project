import {
  FETCH_RANK_REQUEST,
  FETCH_RANK_SUCCESS,
  FETCH_RANK_FAIL,
  FETCH_RANK_SERVICES_SUCCESS,
  FETCH_RANK_SERVICES_REQUEST
} from '../constants/Types';

const INITIAL_STATE = {
  userList: [],
  rankList:[],
  isFetching:true,
  isServiceFetching:true
};

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_RANK_REQUEST:
      return {...state, isFetching: true};
    case FETCH_RANK_SUCCESS:
      return { ...state,isFetching: false,userList:action.payload };
    case FETCH_RANK_SERVICES_REQUEST:
      return { ...state,isServiceFetching: true};
    case FETCH_RANK_SERVICES_SUCCESS:
      return { ...state,isServiceFetching: false,rankList:action.payload };
    case FETCH_RANK_FAIL:
      return { ...state,isFetching: false};
    default:
      return state;   
  }
}
