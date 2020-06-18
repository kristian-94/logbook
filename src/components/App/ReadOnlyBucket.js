import React, {useState, useMemo} from 'react';
import moment from "moment";
import BucketTable from "./bucketTable";
import SweetAlert from 'react-bootstrap-sweetalert';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faTrashRestore} from "@fortawesome/free-solid-svg-icons";

const ReadOnlyBucket = ({clientID, bucket, firebase}) => {
    const [confirmModal, setConfirmModal] = useState(null);

    const data = useMemo(() => {
        // Grab hoursData and format as array and output here.
        const hoursDataFormatted = Object.keys(bucket.hoursData)
            .map(key => ({
                ...bucket.hoursData[key],
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
    }, [bucket.hoursData]);

    const onDeleteBucket = (clientID, bucketData) => {
        firebase.doDeleteBucket(clientID, bucketData).then(r => {
            console.log('deleted bucket ' + bucketData.bucketName);
            setConfirmModal(null);
        });
    }
    const onClickDelete = (clientID, bucketData) => {
        const modal = (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={() => onDeleteBucket(clientID, bucketData)}
                onCancel={() => setConfirmModal(null)}
                focusCancelBtn
            >
                You will not be able to recover this bucket data!
            </SweetAlert>
        );
        setConfirmModal(modal);
    }

    const onUnArchiveBucket = (clientID, bucketData) => {
        firebase.doUnArchiveBucket(clientID, bucketData).then(r => {
            console.log('archived bucket ' + bucketData.bucketName);
            setConfirmModal(null);
        });
    }
    const onClickUnarchive = (clientID, bucketData) => {
        const modal = (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, restore it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={() => onUnArchiveBucket(clientID, bucketData)}
                onCancel={() => setConfirmModal(null)}
                focusCancelBtn
            >
                This will restore this bucket to the main page again.
            </SweetAlert>
        );
        setConfirmModal(modal);
    }

    return (
        <div>
            <h5 className='ml-3'>{bucket.bucketName}</h5>
            {confirmModal}
            <BucketTable data={data} readOnly={true} />
            <button onClick={() => onClickDelete(clientID, bucket)} className="btn btn-danger m-1" type="submit">
                <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faTrash} />
            </button>
            <button onClick={() => onClickUnarchive(clientID, bucket)} className="btn btn-success m-1" type="submit">
                <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faTrashRestore} />
            </button>
        </div>
    )
}

export default ReadOnlyBucket;
