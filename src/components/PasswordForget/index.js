import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
const PasswordForgetPage = () => (
    <div>
        <h1>PasswordForget</h1>
        <PasswordForgetForm />
    </div>
);
const INITIAL_STATE = {
    email: '',
    error: null,
};
class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = event => {
        const { email } = this.state;
        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
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
        const { email, error } = this.state;
        const isInvalid = email === '';
        return (
            <form className="col-md-6 text-center container" onSubmit={this.onSubmit}>
                <div className="form-group row">
                    <div className="col-md-8">
                        <input
                            name="email"
                            className="form-control"
                            autoComplete="on"
                            value={this.state.email}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Email Address"
                        />
                    </div>
                    <div className="col-md-3 m-1">
                        <button className="btn btn-primary" disabled={isInvalid} type="submit">
                            Reset My Password
                        </button>
                    </div>
                </div>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}
const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
);
export default PasswordForgetPage;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };
