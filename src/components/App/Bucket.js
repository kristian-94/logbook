import React, {useEffect, useRef, useState, useMemo} from 'react';
import moment from "moment";
import BucketTable from "./bucketTable";
import SweetAlert from 'react-bootstrap-sweetalert';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {faMinus} from "@fortawesome/free-solid-svg-icons";
import {faArchive} from "@fortawesome/free-solid-svg-icons";

const Bucket = ({clientID, bucket, firebase}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [bucketData, setBucketData] = useState({});
    const [hoursData, setHoursData] = useState(false);
    const [showRemove, setShowRemove] = useState(false);
    const [confirmModal, setConfirmModal] = useState(null);

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);
    useEffect(() => {
        firebase.bucket(clientID, bucket.bucketID).on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                let bucketDataObject = snapshot.val();
                if (bucketDataObject === null) {
                    // No buckets in this client yet.
                    return;
                }
                // Need to get the bucketID attached to our bucket data object here.
                bucketDataObject.bucketID = bucket.bucketID;
                setBucketData(bucketDataObject);
            }
        });
        firebase.hoursData(clientID, bucket).on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                const hoursData = snapshot.val();
                if (hoursData === null) {
                    setBucketData({});
                    return;
                }
                // We don't want to show the remove button if we can't remove.
                if (Object.keys(hoursData).length > 1) {
                    setShowRemove(true);
                } else {
                    setShowRemove(false);
                }
                setHoursData(hoursData);
            }
        });
    }, [bucket, firebase, clientID]);

    const onAddMonth = (clientID, bucketData) => {
        let monthtoadd;
        // Check existing hoursData first, what is our current month we have? Need to append the previous month.
        if (hoursData === false) {
            // This means this is the first entry into this bucket, so we make it the current month.
            monthtoadd = moment().format('MMM YYYY');
        } else {
            const hoursDataFormatted = Object.keys(hoursData)
                .map(key => ({
                    ...hoursData[key],
                    monthID: key,
                }));
            // Go through the hoursData and find which month we need to add now.
            const earliestMonth = moment(Math.min(...hoursDataFormatted.map(e => moment(e.monthandyear, 'MMM YYYY'))));
            monthtoadd = earliestMonth.subtract(1, 'months').format('MMM YYYY');
        }
        firebase.doAddMonth(clientID, bucketData, monthtoadd);
    }
    const onRemoveMonth = (clientID, bucketData) => {
        const hoursDataFormatted = Object.keys(hoursData)
            .map(key => ({
                ...hoursData[key],
                monthID: key,
            }));
        const earliestMonth = moment(Math.min(...hoursDataFormatted.map(e => moment(e.monthandyear, 'MMM YYYY'))));
        const earliestMonthData = hoursDataFormatted.filter(e => e.monthandyear === earliestMonth.format('MMM YYYY'))[0];
        firebase.doRemoveMonth(clientID, bucketData, earliestMonthData.monthID).then(r => console.log('deleted the month ' + earliestMonth.format('MMM YYYY')));
    }

    const onArchiveBucket = (clientID, bucketData) => {
        firebase.doArchiveBucket(clientID, bucketData).then(r => {
            console.log('archived bucket ' + bucketData.bucketName);
            setConfirmModal(null);
        });
    }

    const onClickArchive = (clientID, bucketData) => {
        const modal = (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, archive it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={() => onArchiveBucket(clientID, bucketData)}
                onCancel={() => setConfirmModal(null)}
                focusCancelBtn
            >
                This will archive the bucket. It won't appear on the main page or in reports.
                You can undo this action later.
            </SweetAlert>
        );
        setConfirmModal(modal);
    }

    const data = useMemo(() => {
        // Grab hoursData and format as array and output here.
        const hoursDataFormatted = Object.keys(hoursData)
            .map(key => ({
                ...hoursData[key],
                monthID: key,
            })).sort((month1, month2) => {
                // We want to display the dates in ascending order in our table.
                const date1 = moment(month1.monthandyear, 'MMM YYYY');
                const date2 = moment(month2.monthandyear, 'MMM YYYY');
                return date1 - date2;
            });

        return hoursDataFormatted.map((month) => {
            return (
                {
                    month: month.monthandyear,
                    invoice: month.invoice,
                    description: month.description,
                    in: month.in,
                    out: month.out,
                    remaining: month.remaining,
                    touched: month.touched,
                }
            )
        });
    }, [hoursData]);

    const handleOnUpdateData = (rowData, column, value) => {
        // Find the monthID for this month.
        const monthID = Object.keys(hoursData)
            .map(key => ({
                ...hoursData[key],
                monthID: key,
            })).find(x => x.monthandyear === rowData.month).monthID;
        let values = {};
        values[column] = value;
        // Send this data to firebase.
        firebase.doUpdateHoursData(clientID, bucketData, monthID, values);
    }

    return (
        <div>
            <h5 className='ml-3'>{bucketData.bucketName}</h5>
            {confirmModal}
            <button onClick={() => onAddMonth(clientID, bucketData)} className="btn btn-success m-1" type="submit">
                <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faPlus} />
            </button>
            {showRemove && <button onClick={() => onRemoveMonth(clientID, bucketData)} className="btn btn-secondary m-1" type="submit">
                <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faMinus} />
            </button>}
            <BucketTable data={data} updateData={handleOnUpdateData} />
            <button onClick={() => onClickArchive(clientID, bucketData)} className="btn btn-warning m-1" type="submit">
                <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faArchive} />
            </button>
        </div>
    )
}
export default Bucket;
