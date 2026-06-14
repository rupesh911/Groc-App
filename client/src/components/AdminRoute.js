import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/authService';

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() && isAdmin() ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default AdminRoute;
