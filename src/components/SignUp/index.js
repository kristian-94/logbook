import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import * as ROLES from '../../constants/roles';


const SignUpPage = () => (
    <div className="text-center">
        <h1 className="mt-2">Sign Up</h1>
        <SignUpForm />
        <p className="mt-3">
            Go back to <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </p>
    </div>
);
const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    };
    onSubmit = event => {
        //const { username, email, passwordOne } = this.state;
        const roles = {};
        // All new accounts get the basic role.
        //roles[ROLES.BASIC] = ROLES.BASIC;
        // this.props.firebase
        //     .doCreateUserWithEmailAndPassword(email, passwordOne)
        //     .then(authUser => {
        //         // Create a user in your Firebase realtime database
        //         return this.props.firebase
        //             .user(authUser.user.uid)
        //             .set({
        //                 username,
        //                 email,
        //                 roles,
        //             });
        //     })
        //     .then(authUser => {
        //         this.setState({ ...INITIAL_STATE });
        //         this.props.history.push(ROUTES.CLIENTS);
        //     })
        //     .catch(error => {
        //         this.setState({ error });
        //     });
        // event.preventDefault();
    };
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;
        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <div className="text-center">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <input
                            name="username"
                            value={username}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Full Name"
                        />
                    </div>
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
                            name="passwordOne"
                            value={passwordOne}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            name="passwordTwo"
                            value={passwordTwo}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Confirm Password"
                        />
                    </div>
                    <button className="btn btn-primary" disabled={isInvalid} type="submit">Sign Up</button>
                    {error && <p>{error.message}</p>}
                </form>
            </div>
        );
    }
}
const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };
