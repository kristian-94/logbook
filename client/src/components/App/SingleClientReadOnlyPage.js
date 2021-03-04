import React, { useEffect, useRef, useState } from 'react';
import MonthlySupportHours from './MonthlySupportHours';
import Communications from './Communications';
import ArchivePage from './ArchivePage';
import ReadOnlyBucket from './ReadOnlyBucket';
import { useHistory } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import OwnerDisplay from './OwnerDisplay';
import * as clientActions from '../../store/actions/Clients';
import { useDispatch, useSelector } from 'react-redux';

// Display all the client information in a non editable way.
const SingleClientReadOnlyPage = ({ clientID }) => {
  const [viewingArchive, setViewingArchive] = useState(false);
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const history = useHistory();
  const dispatch = useDispatch();
  const activeClient = useSelector(state => state.clients.activeClient);
  const currentUser = useSelector(state => state.auth.currentUser);

  useEffect(() => {
    // Got to reset some state when switching clients.
    setViewingArchive(false);
  }, [clientID]);

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

  const onViewArchive = () => {
    setViewingArchive(true);
  };

  const onBackToClientPage = () => {
    setViewingArchive(false);
  };

  if (viewingArchive) {
    return (
      <ArchivePage buckets={activeClient.buckets} onBackToClientPage={onBackToClientPage} clientID={clientID} restorable={false}/>
    );
  }

  const onViewClientReport = () => {
    history.push(ROUTES.REPORT + '/' + clientID);
  };

  const onViewClientAdmin = () => {
    history.push(ROUTES.CLIENTADMIN + '/' + clientID);
  };

  const ToAdminPage = () => {
    return <button onClick={onViewClientAdmin} className="btn btn-danger m-1 float-right" type="submit">To Client
      Admin</button>;
  };

  return (
    <div>
      <button onClick={onViewArchive} className="btn btn-warning m-1 float-right" type="submit">View Bucket Archive
      </button>
      <button onClick={onViewClientReport} className="btn btn-warning m-1 float-right" type="submit">To Report</button>
      {currentUser.role === 3 && <ToAdminPage/>}
      <div className="card mt-3">
        <div className="card-header">
          <h1>
            {activeClient.name}
            <OwnerDisplay owner={activeClient.owner}/>
          </h1>
          {Object.keys(activeClient).length !== 0 && <div className="float-left"><i>Last updated
            by {activeClient.lastupdated.username} - {activeClient.lastupdated.date}</i></div>}
        </div>
        <div className="card-body">
          <h5 className="card-title">
            <MonthlySupportHours activeClient={activeClient}/>
          </h5>
          <div>
            {activeClient.note}
          </div>
        </div>
      </div>
      <hr/>
      <div className="container-fluid">
        <div className="row">
          <div className="col-8">
            {activeClient.buckets && activeClient.buckets.map(bucket => {
              if (bucket.archived === 0) {
                return (
                    <div key={bucket.id} className="singlebucket">
                      <ReadOnlyBucket clientID={clientID} bucket={bucket} buttons={false}/>
                      <hr/>
                    </div>
                );
              }
              return null;
            })}
          </div>
          <div className="col-4">
            <Communications clientComms={activeClient.communication} editable={false}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleClientReadOnlyPage;
