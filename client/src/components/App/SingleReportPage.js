import React, { useEffect, useRef } from 'react';
import uuid from 'react-uuid';
import ReportPieChart from './ReportPieChart';
import MonthlySupportHours from './MonthlySupportHours';
import { useHistory } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { useDispatch, useSelector } from 'react-redux';
import * as clientActions from '../../store/actions/Clients';

const SingleReportPage = ({ clientID }) => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const activeClient = useSelector(state => state.clients.activeClient);
  const dispatch = useDispatch();

  // Need this to do a componentwillunmount and cleanup memory leaks.
  useEffect(() => {
    // ComponentWillUnmount in Class Component
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    dispatch(clientActions.fetchClient(clientID));
  }, [clientID, dispatch]);

  let total = 0;
  let chartData = {};
  const history = useHistory();
  const onViewClient = () => {
    history.push(ROUTES.CLIENTS + '/' + clientID);
  };

  return (
    <div>
      <button onClick={onViewClient} className="btn btn-warning m-1 float-right" type="submit">To Client Page</button>
      <h1>{activeClient.name} Report</h1>
      <MonthlySupportHours activeClient={activeClient}/>
      <table className="table">
        <thead className="theat-dark">
        <tr>
          <th scope="col">Bucket Name</th>
          <th scope="col">Total Remaining hours</th>
        </tr>
        </thead>
        <tbody>
        {activeClient.buckets && activeClient.buckets.map(bucket => {
          if (bucket.archived === 1) {
            return null; // No reports on archived buckets.
          }
          let remainingCurrent = 0;
          const hoursarraylength = bucket.hours.length;
          if (hoursarraylength > 0) {
            remainingCurrent = bucket.hours[hoursarraylength - 1].remaining;
          }

          total = total + remainingCurrent;
          chartData[bucket.name] = remainingCurrent;
          return (
            <tr key={bucket.id}>
              <td>{bucket.name}</td>
              <td>{remainingCurrent}</td>
            </tr>
          );
        })}
        <tr className="theat-dark" key={uuid()}>
          <th>Total</th>
          <th>{total}</th>
        </tr>
        </tbody>
      </table>
      <div className="w-25" style={{ marginLeft: 300 }}>
        <ReportPieChart chartData={chartData} clientName={activeClient.name}/>
      </div>
    </div>
  );
};

export default SingleReportPage;
