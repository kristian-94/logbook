import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import * as clientActions from '../../store/actions/Clients';

const NewClientForm = () => {
  const dispatch = useDispatch();
  return (



<div className="col-8">
      <h1>New client</h1>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required to enter a name'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await dispatch(clientActions.createClient(values.name));
          setSubmitting(false);
          console.log('successfully created client ' + values.name);
        }}
      >
        {props => {
          const {
            handleSubmit,
            isSubmitting,
          } = props;
          return (
            <Form className="col-12 text-center container" onSubmit={handleSubmit}>
              <div className="form-group">
                <Field
                  className="form-control col-12 m-1"
                  type="text"
                  name="name"
                  placeholder="Name of client"
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
    </div>
  );
};

export default (NewClientForm);
