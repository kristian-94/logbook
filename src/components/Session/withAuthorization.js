import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import AuthUserContext from './context';
const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            // this.listener = this.props.firebase.auth.onAuthStateChanged(
            //     authUser => {
            //         if (authUser === null) {
            //             return;
            //         }
            //         // Firebase returns some dumb authUser object that we need to ignore.
            //         if (Object.keys(authUser).length > 5) {
            //             return;
            //         }
            //         if (!condition(authUser)) {
            //             this.props.history.push(ROUTES.SIGN_IN);
            //         }
            //     },
            // );
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
