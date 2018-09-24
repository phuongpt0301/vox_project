import {
 FETCH_DUEL_REQUEST,
 FETCH_DUEL_SUCCESS
} from '../constants/Types';

const INITIAL_STATE = {
  duelList: [],
  isFetching:true
};

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_DUEL_REQUEST:
      console.log('fetch duel request');
      return {...state, isFetching: true};
    case FETCH_DUEL_SUCCESS:
      console.log('action.payload',action.payload);   
      return { ...state,isFetching: false,duelList:action.payload };
    default:
      return state;   
  }
}
