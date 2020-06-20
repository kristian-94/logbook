import React, {useState} from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import { withFirebase } from '../Firebase';
import SweetAlert from 'react-bootstrap-sweetalert';

const EditClientForm = ({firebase, clientData, onFinishSubmission, onDeleteClient}) => {
    const [confirmModal, setConfirmModal] = useState(null);

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
                initialValues={{name: clientData.name, monthlysupport: clientData.monthlysupport}}
                validationSchema={Yup.object({
                    name: Yup.string().required("Required to enter a name"),
                })}
                onSubmit={(values, {setSubmitting}) => {
                    setSubmitting(true);
                    // Store this updated client in firebase
                    firebase.doUpdateClient(clientData.clientID, values.name, values.monthlysupport)
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
                                    placeholder={clientData.name}
                                />
                                <ErrorMessage name="name"/>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="monthlysupport" className="m-1 mt-2">Monthly support hours</label>
                                <Field
                                    className="form-control col-8 m-1"
                                    type="text"
                                    name="monthlysupport"
                                    placeholder={clientData.monthlysupport}
                                />
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
