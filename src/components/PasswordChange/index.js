import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};
class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = event => {
        const { passwordOne } = this.state;
        this.props.firebase
            .doPasswordUpdate(passwordOne)
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
        const { passwordOne, passwordTwo, error } = this.state;
        const isInvalid =
            passwordOne !== passwordTwo || passwordOne === '';
        return (
            <form className="col-md-6 text-center container" onSubmit={this.onSubmit}>
                <div className="form-group row text-center">
                    <input
                        name="passwordOne"
                        className="form-control m-1 col-md-4"
                        autoComplete="on"
                        value={passwordOne}
                        onChange={this.onChange}
                        type="password"
                        placeholder="New Password"
                    />
                    <input
                        name="passwordTwo"
                        className="form-control m-1 col-md-4"
                        autoComplete="on"
                        value={passwordTwo}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Confirm New Password"
                    />

                    <button className="btn btn-primary m-1 col-md-3" disabled={isInvalid} type="submit">
                        Change my password
                    </button>
                </div>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}
export default withFirebase(PasswordChangeForm);
