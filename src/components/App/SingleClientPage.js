import React, {useEffect, useRef, useState} from 'react';
import AddBucketForm from "./AddBucketForm";
import EditClientForm from "./EditClientForm";
import Bucket from "./Bucket";
import MonthlySupportHours from "./MonthlySupportHours";
import Communications from "./Communications"
import moment from "moment";
import ArchivePage from "./ArchivePage";
import * as ROUTES from "../../constants/routes";
import {useHistory} from "react-router-dom";
import OwnerDisplay from "./OwnerDisplay";
import {useDispatch, useSelector} from "react-redux";
import * as clientActions from "../../store/actions/Clients";

const SingleClientPage = ({clientID}) => {
    const [addingNewBucket, setAddingNewBucket] = useState(false);
    const [editingClient, setEditingClient] = useState(false);
    const [viewingArchive, setViewingArchive] = useState(false);
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const activeClient = useSelector(state => state.clients.activeClient);
    const [clientNote, setClientNote] = useState('');
    const dispatch = useDispatch();
    useEffect(() => {
        // Got to reset some state when switching clients.
        setAddingNewBucket(false);
        setEditingClient(false);
        setViewingArchive(false);
        dispatch(clientActions.fetchClient(clientID));
    }, [clientID, dispatch]);

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        setClientNote(activeClient.note);
    }, [activeClient]);

    const onCreateBucket = () => {
        setAddingNewBucket(true);
    }
    const onEditClient = () => {
        setEditingClient(true);
    }
    const onViewArchive = () => {
        setViewingArchive(true);
    }
    const onEditClientNote = e => {
        setClientNote(e.target.value);
    }
    const updateClientNote = e => {
        dispatch(clientActions.updateClientNote(clientID, clientNote));
    }

    const onBackToClientPage = () => {
        setAddingNewBucket(false);
        setEditingClient(false);
        setViewingArchive(false);
    }
    const onDeleteClient = () => {
        //firebase.doDeleteClient(clientID).then(() => onBackToClientPage());
    }

    const history = useHistory();
    const onViewClient = () => {
        history.push(ROUTES.CLIENTS + '/' + clientID);
    }

    // Do not start rendering if we can't find the activeClient yet. Still being fetched.
    if (Object.keys(activeClient).length === 0 && activeClient.constructor === Object) {
        return (
            <div>
                <h1>no active client found</h1>
            </div>
        );
    }
    if (addingNewBucket) {
        return (
            <div>
                <AddBucketForm clientID={clientID} onFinishSubmission={onBackToClientPage}/>
            </div>
        );
    }

    if (editingClient) {
        return (
            <div>
                <EditClientForm onDeleteClient={onDeleteClient} clientData={activeClient} onFinishSubmission={onBackToClientPage} owner={activeClient.owner} />
            </div>
        );
    }
    if (viewingArchive) {
        return (
            <ArchivePage BucketsData={activeClient.buckets} onBackToClientPage={onBackToClientPage} clientID={clientID} restorable={true} />
        )
    }

    return (
        <div>
            <button onClick={onViewArchive} className="btn btn-warning m-1 float-right" type="submit">View Bucket Archive</button>
            <button onClick={onCreateBucket} className="btn btn-primary m-1 float-right" type="submit">Create a bucket</button>
            <button onClick={onEditClient} className="btn btn-secondary m-1 float-right" type="submit">Edit Client</button>
            <button onClick={onViewClient} className="btn btn-warning m-1 float-right" type="submit">To Client Page</button>
            <div className="card mt-3 mb-3">
                <div className="card-header">
                    <h1>
                        {activeClient.name}
                        <OwnerDisplay owner={activeClient.owner}/>
                    </h1>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        <MonthlySupportHours activeClient={activeClient} />
                    </h5>
                </div>
            </div>
            <div>
                <textarea
                    className="form-control"
                    onChange={onEditClientNote}
                    onBlur={updateClientNote}
                    value={clientNote}
                    placeholder="Notes"
                    style={{height: '7rem', width: '50rem'}}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
            </div>
            <hr/>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-8">
                        {activeClient.buckets.map(bucket => {
                            return (
                                <div key={bucket.id} className="singlebucket">
                                    <Bucket clientID={clientID} bucket={bucket} />
                                    <hr/>
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-4">
                        <Communications clientID={clientID} clientComms={activeClient.communication} editable={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SingleClientPage;
