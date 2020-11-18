import React, { useEffect, useRef, useState } from 'react';
import BucketTable from './bucketTable';
import SweetAlert from 'react-bootstrap-sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faCheck, faMoneyBill, faPlus } from '@fortawesome/free-solid-svg-icons';
import ContentEditable from 'react-contenteditable';
import stripHtml from 'string-strip-html';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import MonthPicker from './MonthPicker';

const Bucket = ({ bucket, onArchiveBucket, onRemoveMonth, onAddMonth, handleOnUpdateHoursData, onClickMarkPrepaid, handleUpdateBucketName }) => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const [confirmModal, setConfirmModal] = useState(null);
  const [newMonth, SetNewMonth] = useState(new Date());

  // Need this to do a componentwillunmount and cleanup memory leaks.
  useEffect(() => {
    // ComponentWillUnmount in Class Component
    return () => {
      _isMounted.current = false;
    };
  }, []);

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
  };

  const text = useRef(bucket.name);
  const bucketNameUpdated = (e) => {
    text.current = stripHtml(e.target.value);
  };

  const updateBucketName = async () => {
    // Only update if the name was actually changed.
    if (text.current === bucket.name) {
      console.log('bucket name unchanged, not updating');
      return;
    }

    await handleUpdateBucketName(bucket, { name: text.current });
  };

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
          <button onClick={() => onAddMonth(bucket, newMonth)} className="btn btn-success m-1 ml-5 float-left"
                  type="submit">
            <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faPlus}/>
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
            <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faArchive}/>
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
          <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faMoneyBill}/>
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
            <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faCheck}/>
          </button>
        </Tooltip>
      )}
      <BucketTable data={bucket.hours} updateData={handleOnUpdateHoursData} onRemoveMonth={onRemoveMonth}/>
    </div>
  );
};

export default Bucket;
