import React, {useEffect, useRef, useState} from 'react';
import DatePickerComms from "./DatePickerComms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const Communications = ({firebase, clientID}) => {
    const [clientComms, SetClientComms] = useState([]);
    const [newCommText, SetNewCommText] = useState('');
    const [newCommDate, SetNewCommDate] = useState(new Date());
    const _isMounted = useRef(true); // Initial value _isMounted = true

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);
    useEffect(() => {
        firebase.comms(clientID).on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                let commsObject = snapshot.val();
                if (commsObject === null) {
                    return;
                }
                const commsDataFormatted = Object.keys(commsObject)
                    .map(key => ({
                        ...commsObject[key],
                        commsID: key,
                    }));
                SetClientComms(commsDataFormatted);
            }
        });
    }, [firebase, clientID]);

    const onNewCommChangeText = (e) => {
        SetNewCommText(e.target.value);
    }
    const handleChangeDate = date => {
        SetNewCommDate(date);
    };
    const onAddComm = () => {
        const date = newCommDate.toString();
        firebase.doStoreComm(clientID, newCommText, date).then(r => console.log('stored a new communication with text ' + newCommText));
    };
    const onDeleteComm = (commID) => {
        firebase.doDeleteComm(clientID, commID).then(r => console.log('deleted comm'));
    };
    return (
        <div className="container-fluid">
            <h5>Communications notes</h5>
            <div className="col-2" style={{width: '50px'}}>
                <DatePickerComms handleChangeDate={handleChangeDate} displayDate={newCommDate}/>
            </div>
            <div className="col-8">
                <div className="form-group row text-center">
                    <input className="form-control m-1"
                           placeholder="Your text here"
                           onChange={onNewCommChangeText}
                    />
                    <Tooltip
                        placement="right"
                        mouseEnterDelay={0.5}
                        mouseLeaveDelay={0.1}
                        trigger="hover"
                        overlay={<div>Add comms record</div>}
                    >
                        <button onClick={() => onAddComm()} className="btn btn-success m-1" type="submit">
                            <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faPlus} />
                        </button>
                    </Tooltip>
                </div>
            </div>
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
                {clientComms && clientComms.sort((a, b) => {
                    const dateA = (new Date(a.date)).getTime();
                    const dateB = new Date(b.date).getTime();
                    return dateA < dateB ? 1 : -1;
                }).map(commObject => {
                    const time = moment(new Date(commObject.date)).format('MMM Do YYYY')
                    return (
                        <tr key={commObject.commsID}>
                            <td>
                                {time}
                            </td>
                            <td>
                                {commObject.note}
                            </td>
                            <td>
                                <Tooltip
                                    placement="right"
                                    mouseEnterDelay={0.5}
                                    mouseLeaveDelay={0.1}
                                    trigger="hover"
                                    overlay={<div>Delete</div>}
                                >
                                    <button onClick={() => onDeleteComm(commObject.commsID)} className="btn btn-secondary m-1" type="submit">
                                        <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faTrash} />
                                    </button>
                                </Tooltip>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    )
}
export default Communications;
