import React, {useEffect, useRef, useState} from 'react';
import BucketTable from "./bucketTable";
import SweetAlert from 'react-bootstrap-sweetalert';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArchive, faPlus, faMoneyBill, faCheck} from "@fortawesome/free-solid-svg-icons";
import ContentEditable from "react-contenteditable";
import stripHtml from "string-strip-html";
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import {useDispatch} from "react-redux";
import * as clientActions from "../../store/actions/Clients";
import MonthPicker from "./MonthPicker";

const Bucket = ({bucket}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [confirmModal, setConfirmModal] = useState(null);
    const [newMonth, SetNewMonth] = useState(new Date());
    const dispatch = useDispatch();

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);

    const onAddMonth = async () => {
        await dispatch(clientActions.createMonth(bucket, newMonth));
    }
    const onRemoveMonth = async (hours) => {
        await dispatch(clientActions.deleteMonth(hours));
    }

    const onArchiveBucket = async (bucket) => {
        await dispatch(clientActions.updateBucket(bucket, {archived: 1}));
    }

    const onClickMarkPrepaid = async (bucket) => {
        let prepaid = 0;
        if (bucket.prepaid === 0) {
            prepaid = 1;
        }
        await dispatch(clientActions.updateBucket(bucket, {prepaid: prepaid}));
    }

    const onClickArchive = (bucketData) => {
        const modal = (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, archive it!"
                confirmBtnBsStyle="warning"
                title="Are you sure?"
                onConfirm={() => onArchiveBucket(bucketData)}
                onCancel={() => setConfirmModal(null)}
                focusCancelBtn={false}
                focusConfirmBtn={false}
            >
                This will archive the bucket. It won't appear on the main page or in reports.
                You can undo this action later.
            </SweetAlert>
        );
        setConfirmModal(modal);
    }

    const handleOnUpdateHoursData = (hoursid, column, value) => {
        dispatch(clientActions.updateHoursData(hoursid, column, value))
    }
    const text = useRef(bucket.name);
    const bucketNameUpdated = (e) => {
        text.current = stripHtml(e.target.value);
    }
    const updateBucketName = async () => {
        await dispatch(clientActions.updateBucket(bucket, {name: text.current}))
        console.log('bucket updated to have name ' + text.current);
    }
    const handleChangeMonth = date => {
        SetNewMonth(date);
    };
    return (
        <div>
            <h5 className='ml-3'>
                <ContentEditable
                    html={text.current}
                    onChange={bucketNameUpdated}
                    onBlur={updateBucketName}
                    spellCheck={false}
                />
            </h5>
            {confirmModal}
            <div className="float-left row">
                <div className="col-7 mt-2">
                    <MonthPicker handleChangeMonth={handleChangeMonth} displayDate={newMonth}/>
                </div>
                <Tooltip
                placement="left"
                mouseEnterDelay={0.5}
                mouseLeaveDelay={0.1}
                trigger="hover"
                overlay={<div>Add month</div>}
            >
                    <button onClick={() => onAddMonth()} className="btn btn-success m-1 ml-5 float-left" type="submit">
                        <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faPlus} />
                    </button>
            </Tooltip>
            <Tooltip
                placement="right"
                mouseEnterDelay={0.5}
                mouseLeaveDelay={0.1}
                trigger="hover"
                overlay={<div>Archive bucket</div>}
            >
                <button onClick={() => onClickArchive(bucket)} className="btn btn-warning m-1 float-left" type="submit">
                    <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faArchive} />
                </button>
            </Tooltip>
            </div>
            <Tooltip
                placement="right"
                mouseEnterDelay={0.5}
                mouseLeaveDelay={0.1}
                trigger="hover"
                overlay={<div>Mark bucket as prepaid</div>}
            >
                <button onClick={() => onClickMarkPrepaid(bucket)} className="btn btn-info m-1 mr-3 float-right" type="submit">
                    <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faMoneyBill} />
                </button>
            </Tooltip>

            {bucket.prepaid === 1 && (
                <Tooltip
                    placement="right"
                    mouseEnterDelay={0.5}
                    mouseLeaveDelay={0.1}
                    trigger="hover"
                    overlay={<div>This bucket is marked as prepaid</div>}
                >
                    <button className="btn btn-success m-1 float-right" type="submit">
                        <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faCheck} />
                    </button>
                </Tooltip>
            )}
            <BucketTable data={bucket.hours} updateData={handleOnUpdateHoursData} onRemoveMonth={onRemoveMonth} />
        </div>
    )
}
export default Bucket;
