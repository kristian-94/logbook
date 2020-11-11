import React, {useState, useMemo} from 'react';
import BucketTable from "./bucketTable";
import SweetAlert from 'react-bootstrap-sweetalert';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faTrashRestore} from "@fortawesome/free-solid-svg-icons";
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import {useDispatch} from "react-redux";
import * as clientActions from "../../store/actions/Clients";

const ReadOnlyBucket = ({clientID, bucket, buttons}) => {
    const [confirmModal, setConfirmModal] = useState(null);
    const dispatch = useDispatch();

    const data = useMemo(() => {
        // Grab hoursData and format as array and output here.
        const hoursDataFormatted = bucket.hours;

        return hoursDataFormatted.map((month) => {
            return (
                {
                    month: month.month,
                    year: month.year,
                    invoice: month.invoice,
                    description: month.description,
                    in: month.in,
                    out: month.out,
                    remaining: month.remaining,
                    touched: month.touched,
                }
            );
        });
    }, [bucket.hours]);

    const onDeleteBucket = async (bucket) => {
        await dispatch(clientActions.deleteBucket(bucket));
        console.log('Deleted bucket with name ' + bucket.name);
    }
    const onClickDelete = (bucketData) => {
        const modal = (
            <SweetAlert
                danger
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={() => onDeleteBucket(bucketData)}
                onCancel={() => setConfirmModal(null)}
                focusCancelBtn={false}
                focusConfirmBtn={false}
            >
                You will not be able to recover this bucket data!
            </SweetAlert>
        );
        setConfirmModal(modal);
    }

    const onUnArchiveBucket = async (clientID, bucket) => {
        await dispatch(clientActions.updateBucket(bucket, {archived: 0}));
        console.log('Unarchived bucket with name ' + bucket.name);
    }
    const onClickUnarchive = (clientID, bucketData) => {
        const modal = (
            <SweetAlert
                success
                showCancel
                confirmBtnText="Yes, restore it!"
                confirmBtnBsStyle="success"
                title="Are you sure?"
                onConfirm={() => onUnArchiveBucket(clientID, bucketData)}
                onCancel={() => setConfirmModal(null)}
                focusCancelBtn={false}
                focusConfirmBtn={false}
            >
                This will restore this bucket to the main page again.
            </SweetAlert>
        );
        setConfirmModal(modal);
    }

    return (
        <div>
            <h5 className='ml-3'>{bucket.name}</h5>
            <BucketTable data={data} readOnly={true} />
            {buttons && confirmModal}
            {buttons && (
                <div>
                    <Tooltip
                        placement="left"
                        mouseEnterDelay={0.5}
                        mouseLeaveDelay={0.1}
                        trigger="hover"
                        overlay={<div>Delete this bucket</div>}
                    >
                        <button onClick={() => onClickDelete(bucket)} className="btn btn-danger m-1" type="submit">
                            <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faTrash} />
                        </button>
                    </Tooltip>
                    <Tooltip
                        placement="right"
                        mouseEnterDelay={0.5}
                        mouseLeaveDelay={0.1}
                        trigger="hover"
                        overlay={<div>Restore this bucket</div>}
                    >
                        <button onClick={() => onClickUnarchive(clientID, bucket)} className="btn btn-success m-1" type="submit">
                            <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faTrashRestore} />
                        </button>
                    </Tooltip>
                </div>
            )}
        </div>
    )
}

export default ReadOnlyBucket;
