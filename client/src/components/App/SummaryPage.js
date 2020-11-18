import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as clientActions from '../../store/actions/Clients';
import * as authActions from '../../store/actions/Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// This page should show the buckets that have had hours go out in the last 3 months.
const SummaryPage = () => {
  const dispatch = useDispatch();
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const [lastthreemonths, setLastthreemonths] = useState([]);
  const clientData = useSelector(state => state.clients.clientSummaryData);
  const adminUsers = useSelector(state => state.auth.adminUsers);
  const currentUser = useSelector(state => state.auth.currentUser);

  useEffect(() => {
    const currentMonth = moment(new Date()).endOf('month');
    const thisMonth = currentMonth.format('MMM YYYY');
    const lastMonth = currentMonth.subtract(1, 'months').format('MMM YYYY');
    const twomonthsago = currentMonth.subtract(1, 'months').format('MMM YYYY');
    const lastthreemonthsarray = [
      twomonthsago,
      lastMonth,
      thisMonth,
    ];
    setLastthreemonths(lastthreemonthsarray);
    // ComponentWillUnmount in Class Component
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Should only be fetching if we are signed in properly.
    if (currentUser) {
      dispatch(clientActions.fetchClientSummary());
      dispatch(authActions.fetchUsers());
    }
  }, [dispatch, currentUser]);

  if (clientData.length === 0) {
    return (
      <div>
        Loading client summary page
      </div>
    );
  }

  return (
    <div>
      <div className="m-4">
        <h3>What is this?</h3>
        <p>This summary page shows buckets that fit the following criteria:</p>
        <ul>
          <li>The bucket is marked as prepaid: <button className="btn btn-success m-1" type="submit">
            <FontAwesomeIcon icon={faCheck}/>
          </button></li>
          <li>The bucket has hours <u>out</u> in the last 3 months</li>
        </ul>
      </div>
      <Container fluid>
        <table className="table">
          <thead className="theat-dark">
          <tr>
            <th scope="col">Client</th>
            <th scope="col">Owner</th>
            <th scope="col">Bucket</th>
            {lastthreemonths.map(month => {
              return <th key={month} scope="col">{month}</th>;
            })}
          </tr>
          </thead>
          {clientData.map(client => {
            const bucketRender = client.buckets.map(bucket => {
              return (
                <tr key={bucket.id}>
                  <td>{bucket.name}</td>
                  {bucket.hours.map(hours => {
                    return (
                      <td key={hours.id}>{hours.out}</td>
                    );
                  })}
                </tr>
              );
            });

            let user = 'No owner';
            const founduser = adminUsers.find(user => user.id === client.ownerid);
            if (founduser !== undefined) {
              user = founduser.username;
            }

            return (
              <tbody key={client.id}>
              <tr key={client.id}>
                <th rowSpan="5">{client.name}</th>
                <th rowSpan="5">{user}</th>
              </tr>
              {bucketRender}
              </tbody>
            );
          })}
        </table>
      </Container>
    </div>
  );
};

export default (SummaryPage);
