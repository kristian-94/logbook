import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/AppConstants';
import { getAuthConfig } from '../../store/actions/Clients';
import Pagination from "react-js-pagination";

const LogsPage = () => {
  const access_token = useSelector((state => state.auth.currentUser.access_token));
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalitemsCount, setTotalitemsCount] = useState(20);

  const fetchLogs = async (pageNumber) => {
    if (pageNumber === undefined) {
      return;
    }
    const authconfig = getAuthConfig(access_token);
    const response = await axios.get(BACKEND_URL + 'logs?sort=-log_time&page=' + pageNumber, authconfig);
    if (response.status !== 200) {
      throw new Error('Didnt get 200 response when fetching users');
    }
    setTotalitemsCount(parseInt(response.headers['x-pagination-total-count']));
    setPage(pageNumber);
    setLogs(response.data);
  };

  useEffect(() => {
    // Going to fetch the logs on each render of this page. No dispatch or redux state updated.
    fetchLogs(1).then(() => console.log('fetched logs'));
  }, []); //eslint-disable-line

  if (logs.length === 0) {
    return (
      <div className="col-md-10 text-center">
        <h1>Loading logs...</h1>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1>Logs</h1>
      <table style={{ width: '95%' }}>
        <thead>
        <tr style={{ borderBottom: '1px solid black' }}>
          <th>Date</th>
          <th>Category</th>
          <th>Message</th>
        </tr>
        </thead>
        <tbody>
        {logs.map(log => {
          return (
            <tr className="text-left" key={log.id}>
              <td>{log.date}</td>
              <td>{log.category}</td>
              <td>{log.message}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
      <Pagination
        activePage={page}
        itemsCountPerPage={20}
        totalItemsCount={totalitemsCount}
        pageRangeDisplayed={5}
        onChange={fetchLogs}
        itemClass="page-item"
        linkClass="page-link"
      />
    </div>
  );
};

export default (LogsPage);
