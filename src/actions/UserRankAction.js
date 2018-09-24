import {
		FETCH_RANK_REQUEST,
		FETCH_RANK_SUCCESS,
		FETCH_RANK_FAIL,
		FETCH_RANK_SERVICES_SUCCESS,
		FETCH_RANK_SERVICES_REQUEST
	} from '../constants/Types';
import api from '../Utils/api';

export const fetchRankList = (url,data) => {

  return dispatch => {
    dispatch({ type: FETCH_RANK_REQUEST })
     return api.postApi(url,data)
         .then(response => dispatch({ type: FETCH_RANK_SUCCESS,payload:response }))
         .catch(error => console.log('error===',error))
    // return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    //   .then(response => response.json())
    //   .then(json => dispatch(receivePosts(json)))
  }

};

export const fetchRankListService = (url,data) => {

  return dispatch => {
    dispatch({ type: FETCH_RANK_SERVICES_REQUEST })
     return api.postApi(url,data)
         .then(response => dispatch({ type: FETCH_RANK_SERVICES_SUCCESS,payload:response }))
         .catch(error => console.log('error===',error))
  }

};

     