import React, { useEffect, useRef, useState } from 'react';
import DatePickerComms from './DatePickerComms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import * as clientActions from '../../store/actions/Clients';
import { useDispatch } from 'react-redux';

const Communications = ({ clientID, clientComms, editable }) => {
  const [newCommText, SetNewCommText] = useState('');
  const [newCommDate, SetNewCommDate] = useState(new Date());
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const dispatch = useDispatch();

  // Need this to do a componentwillunmount and cleanup memory leaks.
  useEffect(() => {
    // ComponentWillUnmount in Class Component
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Reset state when switching clients.
    SetNewCommText('');
    SetNewCommDate(new Date());
  }, [clientID]);

  const onNewCommChangeText = (e) => {
    SetNewCommText(e.target.value);
  };

  const handleChangeDate = date => {
    SetNewCommDate(date);
  };

  const onAddComm = async () => {
    const date = Math.floor(newCommDate.getTime() / 1000); // Unix timestamp.
    await dispatch(clientActions.addCommunication(clientComms, newCommText, date));
    console.log('stored a new communication with text ' + newCommText + date);
  };

  const onDeleteComm = async (commID) => {
    await dispatch(clientActions.deleteCommunication(clientComms, commID));
    console.log('removed a communication with id ' + commID);
  };

  return (
    <div className="container-fluid">
      <h5>Communications notes</h5>
      {editable && (
        <div>
          <div className="col-2" style={{ width: '50px' }}>
            <DatePickerComms handleChangeDate={handleChangeDate} displayDate={newCommDate}/>
          </div>
          <div className="col-8">
            <div className="form-group row text-center">
              <input className="form-control m-1"
                     placeholder="Your text here"
                     value={newCommText}
                     onChange={onNewCommChangeText}
              />
              <Tooltip
                placement="right"
                mouseEnterDelay={0.5}
                mouseLeaveDelay={0.1}
                trigger="hover"
                overlay={<div>Add comms record</div>}
              >
                <button onClick={() => onAddComm()} className="btn btn-success m-1" style={{ width: '50px' }} type="submit">
                  <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faPlus}/>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      <table style={{ border: 'solid 1px black', width: '98%' }}>
        <thead>
        <tr style={{
          borderBottom: 'solid 3px red',
          background: 'aliceblue',
          color: 'black',
          fontWeight: 'bold',
        }}>
          <th>Date</th>
          <th>Note</th>
        </tr>
        </thead>
        <tbody>
        {clientComms && clientComms.map(commObject => {
          const time = moment(new Date(commObject.date * 1000)).format('MMM Do YYYY');
          return (
            <tr key={commObject.id}>
              <td>
                {time}
              </td>
              <td>
                {commObject.note}
              </td>
              {editable && (
                <td>
                  <Tooltip
                    placement="right"
                    mouseEnterDelay={0.5}
                    mouseLeaveDelay={0.1}
                    trigger="hover"
                    overlay={<div>Delete</div>}
                  >
                    <button onClick={() => onDeleteComm(commObject.id)} className="btn btn-secondary m-1" type="submit">
                      <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faTrash}/>
                    </button>
                  </Tooltip>
                </td>
              )}
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

export default Communications;
