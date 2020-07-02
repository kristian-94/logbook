import React, {useEffect, useRef, useState} from 'react';
import moment from "moment";
import MonthlySupportHours from "./MonthlySupportHours";
import Communications from "./Communications";
import ArchivePage from "./ArchivePage";
import ReadOnlyBucket from "./ReadOnlyBucket";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import {AuthUserContext} from '../Session';
import * as ROLES from "../../constants/roles";

// Display all the client information in a non editable way.
const SingleClientReadOnlyPage = ({clientID, firebase, resetPage}) => {
    const [viewingArchive, setViewingArchive] = useState(false);
    const [bucketsData, setBucketsData] = useState([]);
    const [archivedBucketsData, setArchivedBucketsData] = useState([]);
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [clientData, setClientData] = useState({});
    const history = useHistory();

    useEffect(() => {
        // Got to reset some state when switching clients.
        setViewingArchive(false);
        setBucketsData([]);
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
            <h1>{clientData.name}</h1>
            <MonthlySupportHours clientData={clientData} />
            <div>
                {clientData.noteData}
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
