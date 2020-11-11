import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import * as ROUTES from '../../constants/routes';
import Landing from '../Landing'
import { connect } from 'react-redux';
import * as authActions from "../../store/actions/Auth";

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (email, password) => dispatch(authActions.signIn(email, password))
    }
};
const SignInPage = props => (
    <div className="text-center">
        <Landing/>
        <SignInForm />
        <SignUpLink />
    </div>
);
const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};
class SignInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = event => {
        const { email, password } = this.state;
        this.props.signIn(email, password).then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.LANDING);
                //window.location.reload(); // Ugly.. but means we grab and keep our auth state once each time.
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    };
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { email, password, error } = this.state;
        const isInvalid = password === '' || email === '';
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <input
                            name="email"
                            value={email}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Email Address"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="password"
                            value={password}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <button className="btn btn-primary" disabled={isInvalid} type="submit">
                        Sign In
                    </button>
                    {error && <p>{error.message}</p>}
                </form>
            </div>
        );
    }
}
const SignInForm = compose(
    withRouter,
)(connect(null, mapDispatchToProps)(SignInFormBase));
export default SignInPage;
export { SignInForm };
