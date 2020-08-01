import React, {useEffect, useRef, useState} from 'react';
import MonthlySupportHours from "./MonthlySupportHours";
import Communications from "./Communications";
import ArchivePage from "./ArchivePage";
import ReadOnlyBucket from "./ReadOnlyBucket";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import {AuthUserContext} from '../Session';
import * as ROLES from "../../constants/roles";
import OwnerDisplay from "./OwnerDisplay";

// Display all the client information in a non editable way.
const SingleClientReadOnlyPage = ({clientID, firebase, resetPage}) => {
    const [viewingArchive, setViewingArchive] = useState(false);
    const [bucketsData, setBucketsData] = useState([]);
    const [archivedBucketsData, setArchivedBucketsData] = useState([]);
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [clientData, setClientData] = useState({});
    const [owner, setOwner] = useState('');
    const history = useHistory();

    useEffect(() => {
        // Got to reset some state when switching clients.
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

                // Read only users can not and should not create new months.

                setBucketsData(activeBucketData);
                setArchivedBucketsData(archivedBucketData);
            }
        });
        firebase.client(clientID).on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                const clientDataObject = snapshot.val();
                if (clientDataObject === null) {
                    // No data in this client yet.
                    return;
                }
                delete clientDataObject.buckets;
                if (clientDataObject.owner !== undefined && clientDataObject.owner !== '') {
                    firebase.user(clientDataObject.owner).once('value', snapshot => {
                        const ownerValue = snapshot.val().username;
                        setOwner(ownerValue);
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
    }, [clientID, firebase, resetPage]);
    const onViewArchive = () => {
        setViewingArchive(true);
    }
    const onBackToClientPage = () => {
        setViewingArchive(false);
    }
    if (viewingArchive) {
        return (
            <ArchivePage archivedBucketsData={archivedBucketsData} onBackToClientPage={onBackToClientPage} clientID={clientID} firebase={firebase} restorable={false} />
        )
    }

    const onViewClientReport = () => {
        history.push(ROUTES.REPORT + '/' + clientID);
    }
    const onViewClientAdmin = () => {
        history.push(ROUTES.CLIENTADMIN + '/' + clientID);
    }
    const ToAdminPage = () => {
        return (
            <AuthUserContext.Consumer>
                {authUser => {
                    if (authUser.roles[ROLES.ADMIN]) {
                        return <button onClick={onViewClientAdmin} className="btn btn-danger m-1 float-right" type="submit">To Client Admin</button>
                    }
                    return null;
                }}
            </AuthUserContext.Consumer>
        )
    }
    return (
        <div>
            <button onClick={onViewArchive} className="btn btn-warning m-1 float-right" type="submit">View Bucket Archive</button>
            <button onClick={onViewClientReport} className="btn btn-warning m-1 float-right" type="submit">To Report</button>
            <ToAdminPage />
            <div className="card mt-3">
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
                    <div>
                        {clientData.noteData}
                    </div>
                </div>
            </div>
            <hr/>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-8">
                        {bucketsData && bucketsData.map(bucket => {
                            return (
                                <div key={bucket.bucketID} className="singlebucket">
                                    <ReadOnlyBucket clientID={clientID} bucket={bucket} firebase={firebase} buttons={false}/>
                                    <hr/>
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-4">
                        <Communications firebase={firebase} clientID={clientID} editable={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SingleClientReadOnlyPage;
