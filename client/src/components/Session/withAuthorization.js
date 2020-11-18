import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import AuthUserContext from './context';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      const authUser = JSON.parse(localStorage.getItem('authUser'));
      if (authUser === null) {
        return;
      }

      if (!condition(authUser)) {
        this.props.history.push(ROUTES.SIGN_IN);
      }
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withRouter,
  )(WithAuthorization);
};

export default withAuthorization;
