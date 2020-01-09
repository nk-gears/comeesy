import comeesyAPI from '../api/comeesy';
import history from '../utils/history';
import { userTypes } from './types';
import { openModal, closeModal } from './UIActions';
import Login from '../pages/Login/Login';

import {
  storeToken,
  clearToken,
  getStoredToken,
  validateToken,
} from '../utils/helperFns';

const loadingUser = () => ({
  type: userTypes.LOADING_USER,
});

const userAuthSuccess = () => ({
  type: userTypes.USER_AUTH_SUCCESS,
});
const userAuthFailed = error => ({
  type: userTypes.USER_AUTH_FAILED,
  payload: error,
});

const updateUserDataSuccess = () => ({
  type: userTypes.UPDATE_USER_DATA_SUCCESS,
});

const updateUserDataFailed = error => ({
  type: userTypes.UPDATE_USER_DATA_FAILED,
  payload: error,
});

export const login = data => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(loadingUser());

    comeesyAPI
      .post('/auth/login', data)
      .then(res => {
        resolve();
        const idToken = `Bearer ${res.data.idToken}`;
        storeToken(idToken);
        dispatch(userAuthSuccess());
        dispatch(getUserOwnData());
        dispatch(closeModal());
        if (history.location.pathname === '/auth/login') {
          history.push('/');
        }
      })
      .catch(error => {
        console.error(error);
        dispatch(userAuthFailed(error.response ? error.response.data : null));
        reject(new Error('Something went wrong. Please try again'));
      });
  });

export const signup = data => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(loadingUser());

    comeesyAPI
      .post('/auth/signup', data)
      .then(res => {
        resolve();
        const idToken = `Bearer ${res.data.idToken}`;
        storeToken(idToken);
        dispatch(userAuthSuccess());
        dispatch(getUserOwnData());
        if (history.location.pathname === '/auth/signup') {
          history.push('/');
        }
      })
      .catch(error => {
        console.error(error);
        dispatch(userAuthFailed(error.response ? error.response.data : null));
        reject(new Error('Something went wrong. Please try again'));
      });
  });

export const logout = () => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(loadingUser());
    comeesyAPI
      .get('/auth/logout')
      .then(res => {
        resolve();
        clearToken();
        dispatch({ type: userTypes.LOGOUT });
      })
      .catch(error => {
        console.error(error);
        clearToken();
        dispatch({ type: userTypes.LOGOUT });
        history.push('/');
        reject();
      });
  });

export const getUserOwnData = () => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      const token = getStoredToken();
      if (!hasAuthorization(dispatch)) {
        return dispatch(openModal(Login));
      }

      dispatch(loadingUser());

      const response = await comeesyAPI.get('/user', {
        headers: { Authorization: token },
      });

      resolve(response.data);
      dispatch(userAuthSuccess());
      dispatch({
        type: userTypes.GET_USER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: userTypes.GET_USER_FAILED,
        payload: error.response,
      });
      if (error.response) reject(error.response.data);
    }
  });

export const updateUserDetails = data => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      const token = getStoredToken();
      if (!hasAuthorization(dispatch)) {
        return dispatch(openModal(Login));
      }

      dispatch(loadingUser());

      const response = await comeesyAPI.post('/user/details', data, {
        headers: { Authorization: token },
      });

      resolve(response.data);
      dispatch(updateUserDataSuccess());
      dispatch(getUserOwnData());
    } catch (error) {
      console.error(error);
      if (error.response) {
        dispatch(updateUserDataFailed(error.response.data));
        reject(error.response.data);
      } else reject(new Error('Something went wrong. Please try again'));
    }
  });

export const updateUserCredentials = data => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      const token = getStoredToken();
      if (!hasAuthorization(dispatch)) {
        return dispatch(openModal(Login));
      }

      dispatch(loadingUser());

      const response = await comeesyAPI.post('/user/credentials', data, {
        headers: { Authorization: token },
      });
      resolve(response.data);
      dispatch(updateUserDataSuccess());
      dispatch(getUserOwnData());
    } catch (error) {
      console.error(error);
      if (error.response) {
        dispatch(updateUserDataFailed(error.response.data));
        reject(error.response.data);
      } else reject(new Error('Something went wrong. Please try again'));
    }
  });

export const uploadUserAvatar = formData => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      const token = getStoredToken();
      if (!hasAuthorization(dispatch)) {
        return dispatch(openModal(Login));
      }

      dispatch(loadingUser());

      const response = await comeesyAPI.post('/user/avatar', formData, {
        headers: { Authorization: token },
      });

      resolve(response.data);
      dispatch(updateUserDataSuccess());
      dispatch(getUserOwnData());
    } catch (error) {
      console.error(error.response);
      if (error.response) {
        dispatch(updateUserDataFailed(error.response.data));
        reject(error.response.data);
      } else reject(new Error('Something went wrong. Please try again'));
    }
  });

export const markNotificationsRead = notificationIds => dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      const token = getStoredToken();
      if (!hasAuthorization(dispatch)) {
        return dispatch(openModal(Login));
      }

      const response = await comeesyAPI.post(
        '/notifications/markRead',
        notificationIds,
        {
          headers: { Authorization: token },
        }
      );

      dispatch({
        type: userTypes.MARK_NOTIFICATIONS_READ,
        payload: response.data,
      });

      resolve();
    } catch (error) {
      console.error(error);
      reject();
    }
  });

export const hasAuthorization = dispatch => {
  const token = getStoredToken();
  if (!token || !validateToken(token)) {
    if (dispatch) dispatch(logout());
    return false;
  }
  return true;
};
