import {
		FETCH_DUEL_REQUEST,
    FETCH_DUEL_SUCCESS
} from '../constants/Types';
import api from '../Utils/api';

export const fetchDuelList = (url,data) => {

  return dispatch => {
    dispatch({ type: FETCH_DUEL_REQUEST })
     return api.postApi(url,data)
         .then(response => dispatch({ type: FETCH_DUEL_SUCCESS,payload:response }))
         .catch(error => console.log('error===',error))
  }

};  