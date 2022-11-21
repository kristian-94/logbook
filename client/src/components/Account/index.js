import React from 'react';
import { useSelector } from 'react-redux';

const AccountPage = () => {
  const authUser = useSelector(state => state.auth.currentUser);
  const role = authUser.role === 3 ? 'Admin' : 'Basic';
  return (
    <div>
      <div className="text-center">
        <h3 className="mt-3">Account: {authUser.email}</h3>
        <hr/>
        <h3>Username: {authUser.username}</h3>
        <hr/>
        <h3>Role: {role}</h3>
      </div>
    </div>
  );
};

export default (AccountPage);
