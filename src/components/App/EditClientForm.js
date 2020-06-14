import React, {} from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import { withFirebase } from '../Firebase';

const EditClientForm = ({firebase, clientData, onFinishSubmission, onDeleteClient}) => {

    return (
        <div className="col-10">
            <h1>Edit Client {clientData.name}</h1>
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
                            <div className="form-group">
                                <Field
                                    className="form-control col-12 m-1"
                                    type="text"
                                    name="name"
                                    placeholder={clientData.name}
                                />
                                <ErrorMessage name="name"/>
                            </div>
                            <div className="form-group">
                                <Field
                                    className="form-control col-12 m-1"
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
            <button onClick={onDeleteClient} className="btn btn-danger m-1" type="submit">Delete client</button>
        </div>
    );
};
export default withFirebase(EditClientForm);
