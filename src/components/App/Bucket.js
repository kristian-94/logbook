import React, {useEffect, useMemo, useRef, useState} from 'react';
import moment from "moment";
import BucketTable from "./bucketTable";
import SweetAlert from 'react-bootstrap-sweetalert';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArchive, faMinus, faPlus, faMoneyBill, faCheck} from "@fortawesome/free-solid-svg-icons";
import ContentEditable from "react-contenteditable";
import stripHtml from "string-strip-html";
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const Bucket = ({clientID, bucket}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [confirmModal, setConfirmModal] = useState(null);

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);

    const onAddMonth = (clientID, bucketData) => {
        let monthtoadd;
        // Check existing hoursData first, what is our current month we have? Need to append the previous month.
        //firebase.doAddMonth(clientID, bucketData, monthtoadd);
    }
    const onRemoveMonth = (clientID, bucketData) => {
        // const earliestMonth = moment(Math.min(...hoursDataFormatted.map(e => moment(e.monthandyear, 'MMM YYYY'))));
        // const earliestMonthData = hoursDataFormatted.filter(e => e.monthandyear === earliestMonth.format('MMM YYYY'))[0];
        //firebase.doRemoveMonth(clientID, bucketData, earliestMonthData.monthID).then(r => console.log('deleted the month ' + earliestMonth.format('MMM YYYY')));
    }

    const onArchiveBucket = (clientID, bucketData) => {
        // firebase.doArchiveBucket(clientID, bucketData).then(r => {
        //     console.log('archived bucket ' + bucketData.name);
        // });
    }

    const onClickMarkPrepaid = (clientID, bucketData) => {
        // firebase.doMarkBucketPrepaid(clientID, bucketData).then(r => {
        //     console.log('Changed prepaid status of ' + bucketData.name);
        // });
    }

    const onClickArchive = (clientID, bucketData) => {
        const modal = (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, archive it!"
                confirmBtnBsStyle="warning"
                title="Are you sure?"
                onConfirm={() => onArchiveBucket(clientID, bucketData)}
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

    const handleOnUpdateData = (rowData, column, value) => {
        // Find the monthID for this month.
        // const monthID = Object.keys(hoursData)
        //     .map(key => ({
        //         ...hoursData[key],
        //         monthID: key,
        //     })).find(x => x.monthandyear === rowData.month).monthID;
        // let values = {};
        // values[column] = value;
        // Send this data to firebase.
        //firebase.doUpdateHoursData(clientID, bucketData, monthID, values);
    }
    const text = useRef(bucket.name);
    const bucketNameUpdated = (e) => {
        text.current = stripHtml(e.target.value);
    }
    const updateBucketName = () => {
        // firebase.doUpdateBucket(clientID, bucket, text.current)
        //     .then(r => console.log('bucket updated to have name ' + text.current));
    }
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
            <Tooltip
                placement="left"
                mouseEnterDelay={0.5}
                mouseLeaveDelay={0.1}
                trigger="hover"
                overlay={<div>Add month</div>}
            >
                <button onClick={() => onAddMonth(clientID, bucket)} className="btn btn-success m-1" type="submit">
                    <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faPlus} />
                </button>
            </Tooltip>
            <Tooltip
                    placement="top"
                    mouseEnterDelay={0.5}
                    mouseLeaveDelay={0.1}
                    trigger="hover"
                    overlay={<div>Remove oldest month</div>}
                >
                    <button onClick={() => onRemoveMonth(clientID, bucket)} className="btn btn-secondary m-1" type="submit">
                        <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faMinus} />
                    </button>
            </Tooltip>
            <Tooltip
                placement="right"
                mouseEnterDelay={0.5}
                mouseLeaveDelay={0.1}
                trigger="hover"
                overlay={<div>Archive bucket</div>}
            >
                <button onClick={() => onClickArchive(clientID, bucket)} className="btn btn-warning m-1" type="submit">
                    <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faArchive} />
                </button>
            </Tooltip>
            <Tooltip
                placement="right"
                mouseEnterDelay={0.5}
                mouseLeaveDelay={0.1}
                trigger="hover"
                overlay={<div>Mark bucket as prepaid</div>}
            >
                <button onClick={() => onClickMarkPrepaid(clientID, bucket)} className="btn btn-info m-1 mr-3 float-right" type="submit">
                    <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faMoneyBill} />
                </button>
            </Tooltip>
            {bucket.prepaid === true && (
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
            <BucketTable data={bucket.hours} updateData={handleOnUpdateData} />
        </div>
    )
}
export default Bucket;
