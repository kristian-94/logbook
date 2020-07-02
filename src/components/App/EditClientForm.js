import React, {useEffect, useState} from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import { withFirebase } from '../Firebase';
import SweetAlert from 'react-bootstrap-sweetalert';
import * as ROLES from "../../constants/roles";

const EditClientForm = ({firebase, clientData, onFinishSubmission, onDeleteClient}) => {
    const [confirmModal, setConfirmModal] = useState(null);
    const [adminUsers, setAdminUsers] = useState([]);

    useEffect(() => {
        firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));
            const adminUsers = usersList.filter(user => {
                return user.roles[ROLES.ADMIN] === ROLES.ADMIN;
            });
            setAdminUsers(adminUsers);
        });
    }, [firebase]);

    const onClickDeleteClient = () => {
        const modal = (
            <SweetAlert
                danger
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={() => onDeleteClient()}
                onCancel={() => setConfirmModal(null)}
                focusCancelBtn={false}
                focusConfirmBtn={false}
            >
                You will not be able to recover any data for this client!
            </SweetAlert>
        );
        setConfirmModal(modal);
    }
    return (
        <div className="col-10">
            <h1>Edit Client {clientData.name}</h1>
            {confirmModal}
            <Formik
                initialValues={{name: clientData.name, monthlysupport: clientData.monthlysupport, owner: ''}}
                validationSchema={Yup.object({
                    name: Yup.string().required("Required to enter a name"),
                })}
                onSubmit={(values, {setSubmitting}) => {
                    setSubmitting(true);
                    // Store this updated client in firebase
                    firebase.doUpdateClient(clientData.clientID, values.name, values.monthlysupport, values.owner)
                        .then(() => {
                            setSubmitting(false);
                            onFinishSubmission('successfully updated client ' + values.name);
                        });
                }}
            >
                {props => {
                    const {
                        handleSubmit,
                        isSubmitting,
                    } = props;
                    return (
                        <Form className="col-10 text-center container" onSubmit={handleSubmit}>
                            <div className="form-group row">
                                <label htmlFor="name" className="m-1 mt-2">Client Name</label>
                                <Field
                                    className="form-control col-8 m-1"
                                    type="text"
                                    name="name"
                                    value={clientData.name}
                                />
                                <ErrorMessage name="name"/>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="monthlysupport" className="m-1 mt-2">Support hours per month</label>
                                <Field
                                    className="form-control col-8 m-1"
                                    type="text"
                                    name="monthlysupport"
                                    value={clientData.monthlysupport}
                                />
                            </div>
                            <div className="form-group row">
                                <label htmlFor="owner" className="m-1 mt-2">Set Owner</label>
                                <Field as="select"
                                    name="owner"
                                    value={adminUsers.username}
                                    style={{ display: 'block' }}
                                >
                                    <option value="" label="Select an owner" />
                                    {adminUsers && adminUsers.map(user => <option key={user.uid} value={user.uid} label={user.username} />)}
                                </Field>
                            </div>
                            <button
                                className="btn btn-primary m-1"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Submit
                            </button>
                        </Form>
                    );
                }}
            </Formik>
            <button onClick={onFinishSubmission} className="btn btn-secondary m-1" type="submit">Cancel</button>
            <button onClick={() => onClickDeleteClient()} className="btn btn-danger m-1" type="submit">Delete client</button>
        </div>
    );
};
export default withFirebase(EditClientForm);
