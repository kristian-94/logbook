import React, {useEffect, useRef, useState} from 'react';
import AddBucketForm from "./AddBucketForm";

const SingleClientPage = ({clientID, firebase}) => {
    const [addingNewBucket, setAddingNewBucket] = useState(false);
    const [bucketsData, setBucketsData] = useState([]);
    const [displayMessage, setDisplayMessage] = useState("No bucket saved yet, fill out the form above.");
    const _isMounted = useRef(true); // Initial value _isMounted = true

    useEffect(() => {
        // Got to reset some state when switching clients.
        setAddingNewBucket(false);
        setBucketsData([]);
    }, [clientID]);


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
                    return;
                }
                const bucketsData = Object.keys(bucketsDataObject)
                    .map(key => ({
                        ...bucketsDataObject[key],
                        bucketID: key,
                    }));
                // Make alphabetical order.
                bucketsData.sort((bucket1, bucket2) => bucket1['name'] - bucket2['name']);
                setBucketsData(bucketsData);
            }
        });
    }, [clientID, firebase]);

    const onCreateBucket = () => {
        setAddingNewBucket(true);
    }

    const handleOnFinishSubmission = (finishMessage) => {
        setDisplayMessage(finishMessage);
        setAddingNewBucket(false);
    }
    const onBackToClientPage = () => {
        setAddingNewBucket(false);
    }

    if (addingNewBucket) {
        return (
            <div>
                <AddBucketForm cancelForm={onBackToClientPage} clientID={clientID} onFinishSubmission={handleOnFinishSubmission}/>
                <p>{displayMessage}</p>
            </div>
        );
    }

    return (
        <div>
            <button onClick={onCreateBucket} className="btn btn-primary m-1 float-right" type="submit">Create a bucket</button>
            <div>
                {bucketsData && bucketsData.map(bucket => {
                    return (
                        <div key={bucket.bucketID}>
                            <p>{bucket.bucketName}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default SingleClientPage;
