import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';
import * as ROUTES from '../../constants/routes';
import {connect} from 'react-redux';
import * as authActions from '../../store/actions/Auth';

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (email, password) => dispatch(authActions.signIn(email, password)),
    };
};

class DemoSignInFormBase extends Component {
    constructor(props) {
        super(props);
    }

    onSubmit = event => {
        this.props.signIn(process.env.REACT_APP_ADMIN_USERNAME, process.env.REACT_APP_ADMIN_USERNAME).then(() => {
            this.props.history.push(ROUTES.LANDING);
        }).catch(error => {
            this.setState({error});
        });
        event.preventDefault();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <button className="btn btn-primary" type="submit">
                        Use Demo Admin Account
                    </button>
                </form>
                OR:
            </div>
        );
    }
}

const DemoSignInForm = compose(withRouter)(connect(null, mapDispatchToProps)(DemoSignInFormBase));
export {DemoSignInForm};
