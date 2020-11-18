import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import * as clientActions from '../../store/actions/Clients';

const EditClientForm = ({ clientData, onFinishSubmission, onDeleteClient, owner }) => {
  const [confirmModal, setConfirmModal] = useState(null);
  const adminusers = useSelector(state => state.auth.adminUsers);
  const dispatch = useDispatch();

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
  };

  return (



<div className="col-10">
      <h1>Edit Client {clientData.name}</h1>
      {confirmModal}
      <Formik
        initialValues={{ name: clientData.name, support: clientData.support, owner: owner }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required to enter a name'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          const updatedata = {
            name: values.name,
            support: values.support,
          };
          if (typeof values.owner === 'string' && values.owner !== '') {
            if (values.owner !== '0') {
              updatedata['ownerid'] = Number(values.owner);
            } else {
              updatedata['ownerid'] = null;
            }
          }

          dispatch(clientActions.updateClient(clientData.id, updatedata));
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
                <label htmlFor="support" className="m-1 mt-2">Support hours per month</label>
                <Field
                  className="form-control col-8 m-1"
                  type="text"
                  name="support"
                  placeholder={clientData.support}
                />
              </div>
              <div className="form-group row">
                <label htmlFor="owner" className="m-1 mt-2">Set Owner</label>
                <Field as="select"
                       name="owner"
                       style={{ display: 'block' }}
                >
                  <option value="" label="Select an owner"/>
                  {adminusers && adminusers.map(user => <option key={user.id} value={user.id} label={user.username}/>)}
                  <option value={0} label="No owner"/>
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

export default EditClientForm;
