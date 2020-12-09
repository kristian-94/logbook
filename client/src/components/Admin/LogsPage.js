import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/AppConstants';
import { getAuthConfig } from '../../store/actions/Clients';
import Pagination from "react-js-pagination";
const DEFAULT_PAGE_SIZE = 20;

const LogsPage = () => {
  const access_token = useSelector((state => state.auth.currentUser.access_token));
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [perpage, setperpage] = useState(DEFAULT_PAGE_SIZE);
  const [totalitemsCount, setTotalitemsCount] = useState(20);

  const fetchLogs = async (pageNumber, pagesize = perpage) => {
    if (pageNumber === undefined) {
      return;
    }
    const authconfig = getAuthConfig(access_token);
    const response = await axios.get(BACKEND_URL + 'logs?sort=-log_time&page=' + pageNumber + '&per-page=' + pagesize, authconfig);
    if (response.status !== 200) {
      throw new Error('Didnt get 200 response when fetching users');
    }
    setTotalitemsCount(parseInt(response.headers['x-pagination-total-count']));
    setperpage(parseInt(response.headers['x-pagination-per-page']));
    setPage(pageNumber);
    setLogs(response.data);
  };

  const onClickPerPage = (newpagelimit) => {
    if (newpagelimit > 0 && newpagelimit <= 1000) {
      fetchLogs(page, newpagelimit);
    }
  }

  const PageLimitSetter = () => {
    // Make the currently selected page size shown as active with a success button.
    return (
      <div>
        <h5>Logs per page</h5>
        <button onClick={() => onClickPerPage(DEFAULT_PAGE_SIZE)}
                className={"btn m-1 " + (perpage === DEFAULT_PAGE_SIZE ? 'btn-success' : 'btn-secondary')}
                type="submit">
          {DEFAULT_PAGE_SIZE}
        </button>
        <button onClick={() => onClickPerPage(50)}
                className={"btn m-1 " + (perpage === 50 ? 'btn-success' : 'btn-secondary')}
                type="submit">
          50
        </button>
        <button onClick={() => onClickPerPage(100)}
                className={"btn m-1 " + (perpage === 100 ? 'btn-success' : 'btn-secondary')}
                type="submit">
          100
        </button>
        <button onClick={() => onClickPerPage(1000)}
                className={"btn m-1 " + (perpage === 1000 ? 'btn-success' : 'btn-secondary')}
                type="submit">
          1000
        </button>
      </div>
    );
  }

  useEffect(() => {
    // Going to fetch the logs on each render of this page. No dispatch or redux state updated.
    fetchLogs(1, DEFAULT_PAGE_SIZE).then(() => console.log('fetched logs'));
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
          <th style={{ minWidth: '250px' }}>Date</th>
          <th>Category</th>
          <th>Message</th>
        </tr>
        </thead>
        <tbody>
        {logs.map(log => {
          return (
            <tr className="text-left" key={log.id}>
              <td className="logtablecell">{log.date}</td>
              <td className="logtablecell">{log.category}</td>
              <td className="logtablecell">{log.message}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
      <div>
        <Pagination
          activePage={page}
          itemsCountPerPage={perpage}
          totalItemsCount={totalitemsCount}
          pageRangeDisplayed={5}
          onChange={fetchLogs}
          itemClass="page-item"
          linkClass="page-link"
        />
        <PageLimitSetter/>
      </div>
    </div>
  );
};

export default (LogsPage);
