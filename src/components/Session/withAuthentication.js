import React from 'react';
import AuthUserContext from './context';
const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                authUser: JSON.parse(localStorage.getItem('authUser')),
            };
        }
        setAuthUserInLocalStorage = (authUser) => {
            localStorage.setItem('authUser', JSON.stringify(authUser));
            this.setState({ authUser });
        };
        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }
    return WithAuthentication;
};
export default withAuthentication;
