import React, {useEffect, useRef, useState} from 'react';
import moment from "moment";
import uuid from 'react-uuid'
import ReportPieChart from "./ReportPieChart";
import MonthlySupportHours from "./MonthlySupportHours";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../../constants/routes";

const SingleReportPage = ({clientID, firebase, resetPage}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [bucketsData, setBucketsData] = useState([]);
    const [clientData, setClientData] = useState({});

    useEffect(() => {
        // Got to reset some state when switching clients.
        setBucketsData([]);
        setClientData({});
    }, [clientID, resetPage]);

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
                    })).filter(bucket => {
                        return bucket.archived !== true;
                    });
                // Make alphabetical order.
                bucketsData.sort((bucket1, bucket2) => bucket1['name'] - bucket2['name']);
                setBucketsData(bucketsData);
            }
        });
        firebase.client(clientID).on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                const clientDataObject = snapshot.val();
                if (clientDataObject === null) {
                    // No buckets in this client yet.
                    return;
                }
                delete clientDataObject.buckets;
                const clientData = {
                    'name': clientDataObject.name,
                    'clientID': clientID,
                    'noteData': clientDataObject.noteData,
                    'monthlysupport': clientDataObject.monthlysupport,
                };
                setClientData(clientData);
            }
        });
    }, [clientID, firebase]);

    let total = 0;
    let chartData = {};
    const history = useHistory();
    const onViewClient = () => {
        history.push(ROUTES.CLIENTS + '/' + clientID);
    }

    return (
        <div>
            <button onClick={onViewClient} className="btn btn-warning m-1 float-right" type="submit">To Client Page</button>
            <h1>{clientData.name} Report</h1>
            <MonthlySupportHours clientData={clientData} />
            <table className="table">
                <thead className="theat-dark">
                <tr>
                    <th scope="col">Bucket Name</th>
                    <th scope="col">Total Remaining hours</th>
                </tr>
                </thead>
                <tbody>
                {bucketsData && bucketsData.map(bucket => {
                    const hoursDataFormatted = Object.keys(bucket.hoursData)
                        .map(key => ({
                            ...bucket.hoursData[key],
                            monthID: key,
                        }));
                    const currentMonth = moment(Math.max(...hoursDataFormatted.map(e => moment(e.monthandyear, 'MMM YYYY'))));
                    const currentMonthData = hoursDataFormatted.filter(e => e.monthandyear === currentMonth.format('MMM YYYY'))[0];
                    const remainingCurrent = currentMonthData.remaining;
                    total = total + remainingCurrent;
                    chartData[bucket.bucketName] = remainingCurrent;
                    return (
                        <tr key={bucket.bucketID}>
                            <td>{bucket.bucketName}</td>
                            <td>{remainingCurrent}</td>
                        </tr>
                    );
                })}
                <tr className="theat-dark" key={uuid()}>
                    <th>Total</th>
                    <th>{total}</th>
                </tr>
                </tbody>
            </table>
            <div className="w-25" style={{ marginLeft: 300 }}>
                <ReportPieChart chartData={chartData} clientName={clientData.name}/>
            </div>
        </div>
    );
}
export default SingleReportPage;
