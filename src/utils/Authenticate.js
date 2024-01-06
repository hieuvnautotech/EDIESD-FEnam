import { resetStores, useUserStore } from '@stores';
import React from 'react';
import { Redirect } from 'react-router-dom';

const firstLogin = {};
const isAuthenticate = () => {
  let isAuthen = false;
  const currentUser = useUserStore.getState().user;
  if (currentUser) {
    if (currentUser.userId) {
      isAuthen = true;
    }
  }
  return isAuthen;
};

const AuthenticateRoute = (Component, route) => (props) => {
  if (!isAuthenticate()) {
    return <Redirect to={route || '/login'} />;
  }
  if (Component === null) {
    return null;
  }

  return <Component {...props} />;
};

const NotAuthenticateRoute = (Component, route) => (props) => {
  if (isAuthenticate()) {
    return <Redirect to={route || '/'} />;
  }

  if (Component === null) {
    return null;
  }
  return <Component {...props} />;
};

const LogoutRoute = () => (props) => {
  logOut();
  return <Redirect to={'/'} />;
};

const logOut = () => {
  resetStores.resetAllStores();
};

export {
  firstLogin,
  isAuthenticate,
  AuthenticateRoute,
  NotAuthenticateRoute,
  // checkExpired,
  logOut,
  LogoutRoute,
};
