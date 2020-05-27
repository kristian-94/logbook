import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { withFirebase } from '../Firebase';
import moment from "moment";

const AddBucketForm = ({firebase, clientID, onFinishSubmission, cancelForm}) => {
    return (
        <div className="col-10">
            <h1>New bucket</h1>
            <Formik
                initialValues={{name: ""}}
                validationSchema={Yup.object({
                    name: Yup.string().required("Required to enter a name"),
                })}
                onSubmit={(values, {setSubmitting}) => {
                    setSubmitting(true);
                    const timeCreated = (new moment()).toJSON(); // Can't store the date as an object.
                    // Store this client in firebase
                    firebase.doStoreBucket(values.name, timeCreated, clientID)
                        .then(() => {
                            setSubmitting(false);
                            onFinishSubmission('successfully created bucket ' + values.name);
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
                                    placeholder="Name of bucket"
                                />
                                <ErrorMessage name="name"/>
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
            <button onClick={cancelForm} className="btn btn-danger m-1" type="submit">Cancel</button>
        </div>
    );
}
export default withFirebase(AddBucketForm);
