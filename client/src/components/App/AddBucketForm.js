import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import * as clientActions from '../../store/actions/Clients';

const AddBucketForm = ({ clientID, onFinishSubmission, cancelForm }) => {
  const dispatch = useDispatch();
  return (



<div className="col-10">
      <h1>New bucket</h1>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required to enter a name'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await dispatch(clientActions.createBucket(clientID, values.name));
          setSubmitting(false);
          onFinishSubmission();
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
      <button onClick={onFinishSubmission} className="btn btn-danger m-1" type="submit">Cancel</button>
    </div>
  );
};

export default AddBucketForm;
