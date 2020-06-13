import React, {useEffect, useRef, useState} from 'react';
import AddBucketForm from "./AddBucketForm";
import EditClientForm from "./EditClientForm";
import Bucket from "./Bucket";

const SingleReportPage = ({clientID, firebase}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [bucketsData, setBucketsData] = useState([]);


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
                // Make alphabetical order.
                bucketsData.sort((bucket1, bucket2) => bucket1['name'] - bucket2['name']);
                console.log(bucketsData);
                setBucketsData(bucketsData);
            }
        });
    }, [clientID, firebase]);

    return (
        <div>
            <h1>Report</h1>
            <h4>{clientID}</h4>
            {bucketsData && bucketsData.map(bucket => {
                return (
                    <div key={bucket.bucketID}>
                        {bucket.bucketName}
                    </div>
                );
            })}
        </div>
    );
}
export default SingleReportPage;
