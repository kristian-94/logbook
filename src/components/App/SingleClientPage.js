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

const SingleClientPage = ({clientID, firebase, resetPage}) => {
    const [addingNewBucket, setAddingNewBucket] = useState(false);
    const [editingClient, setEditingClient] = useState(false);
    const [viewingArchive, setViewingArchive] = useState(false);
    const [bucketsData, setBucketsData] = useState([]);
    const [archivedBucketsData, setArchivedBucketsData] = useState([]);
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [clientData, setClientData] = useState({});
    const [owner, setOwner] = useState('');

    useEffect(() => {
        // Got to reset some state when switching clients.
        setAddingNewBucket(false);
        setEditingClient(false);
        setViewingArchive(false);
        setBucketsData([]);
        setOwner('');
    }, [clientID, resetPage]);


    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);
    useEffect(() => {
        firebase.buckets(clientID).on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                const bucketsDataObject = snapshot.val();
                if (bucketsDataObject === null) {
                    // No buckets in this client yet.
                    setBucketsData([]);
                    return;
                }
                const bucketsData = Object.keys(bucketsDataObject)
                    .map(key => ({
                        ...bucketsDataObject[key],
                        bucketID: key,
                    }));
                const archivedBucketData = bucketsData.filter(bucket => {
                    return bucket.archived === true;
                });
                const activeBucketData = bucketsData.filter(bucket => {
                    return bucket.archived !== true;
                });
                // Make alphabetical order.
                activeBucketData.sort((bucket1, bucket2) => bucket1['name'] - bucket2['name']);
                archivedBucketData.sort((bucket1, bucket2) => bucket1['name'] - bucket2['name']);
                // Check each bucket to see if we need to add the current month now.
                activeBucketData.map(bucket => {
                    const hoursDataFormatted = Object.keys(bucket.hoursData)
                        .map(key => ({
                            ...bucket.hoursData[key],
                            monthID: key,
                        }));
                    // Go through the hoursData and find latest and compare that to current to see if we need to add a month now.
                    const latestMonthinBucket = moment(Math.max(...hoursDataFormatted.map(e => moment(e.monthandyear, 'MMM YYYY')))).format('MMM YYYY');
                    const currentMonth = moment().format('MMM YYYY');
                    if (currentMonth !== latestMonthinBucket) {
                        firebase.doAddMonth(clientID, bucket, currentMonth).then(r => console.log('added month ' + currentMonth));
                    }
                    return true;
                });
                setBucketsData(activeBucketData);
                setArchivedBucketsData(archivedBucketData);
            }
        });
        firebase.client(clientID).on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                const clientDataObject = snapshot.val();
                if (clientDataObject === null) {
                    // No buckets in this client yet.
                    return;
                }
                delete clientDataObject.buckets;
                if (clientDataObject.owner !== undefined && clientDataObject.owner !== '') {
                    firebase.user(clientDataObject.owner).once('value', snapshot => {
                        const value = snapshot.val();
                        let ownerName = '';
                        if (value !== null) {
                            ownerName = snapshot.val().username;
                        }
                        setOwner(ownerName);
                    });
                }
                const clientData = {
                    'name': clientDataObject.name,
                    'clientID': clientID,
                    'noteData': clientDataObject.noteData,
                    'monthlysupport': clientDataObject.monthlysupport,
                };
                setClientData(clientData);
            }
        });
    }, [clientID, firebase]);

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
        const noteData = e.target.value;
        setClientData((prevState) => ({...prevState, noteData}));
    }
    const updateClientNote = e => {
        firebase.doUpdateClientNote(clientID, clientData.noteData).then(r => console.log('updated client note'));
    }

    const onBackToClientPage = () => {
        setAddingNewBucket(false);
        setEditingClient(false);
        setViewingArchive(false);
    }
    const onDeleteClient = () => {
        firebase.doDeleteClient(clientID).then(() => onBackToClientPage());
    }

    const history = useHistory();
    const onViewClient = () => {
        history.push(ROUTES.CLIENTS + '/' + clientID);
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
                <EditClientForm onDeleteClient={onDeleteClient} clientData={clientData} onFinishSubmission={onBackToClientPage} owner={owner}/>
            </div>
        );
    }
    if (viewingArchive) {
        return (
            <ArchivePage archivedBucketsData={archivedBucketsData} onBackToClientPage={onBackToClientPage} clientID={clientID} firebase={firebase} restorable={true} />
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
                        {clientData.name}
                        <OwnerDisplay owner={owner}/>
                    </h1>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        <MonthlySupportHours clientData={clientData} />
                    </h5>
                </div>
            </div>
            <div>
                <textarea
                    className="form-control"
                    onChange={onEditClientNote}
                    onBlur={updateClientNote}
                    value={clientData.noteData}
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
                        {bucketsData && bucketsData.map(bucket => {
                            return (
                                <div key={bucket.bucketID} className="singlebucket">
                                    <Bucket clientID={clientID} bucket={bucket} firebase={firebase}/>
                                    <hr/>
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-4">
                        <Communications firebase={firebase} clientID={clientID} editable={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SingleClientPage;
