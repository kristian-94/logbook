import React, {useEffect, useRef, useState} from 'react';
import { withAuthorization } from '../Session';
import {Container} from "react-bootstrap";
import * as ROLES from '../../constants/roles'
import moment from "moment";

const SummaryPage = ({firebase}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [clientData, setBucketData] = useState([]);
    const [lastthreemonths, setLastthreemonths] = useState([]);

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        const currentMonth = moment(new Date()).endOf('month');
        const thisMonth = currentMonth.format('MMM YYYY');
        const lastMonth = currentMonth.subtract(1, 'months').format('MMM YYYY');
        const twomonthsago = currentMonth.subtract(1, 'months').format('MMM YYYY');
        const lastthreemonthsarray = [
            twomonthsago,
            lastMonth,
            thisMonth,
        ];
        setLastthreemonths(lastthreemonthsarray);
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        firebase.clients().on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.

                const clientsObject = snapshot.val();
                //let allBuckets = [];
                const clientsList = Object.keys(clientsObject)
                    .map(key => ({
                        ...clientsObject[key],
                        clientID: key,
                    }));
                const clientBuckets = clientsList.reduce((filtered, client) => {
                    const bucketArray = Object.keys(client.buckets)
                        .map(key => ({
                            ...client.buckets[key],
                            bucketID: key,
                        }));
                    const bucketArrayFiltered = bucketArray.filter(bucket => {
                        // Check if we should add this bucket to our array.

                        if (bucket.prepaid !== true) {
                            // We only include buckets that are marked as prepaid.
                            return false;
                        }
                        const hoursDataObject = bucket.hoursData;
                        const hoursDataArray = Object.keys(hoursDataObject)
                            .map(key => ({
                                ...bucket.hoursData[key],
                                hoursID: key,
                            }));
                        const results = hoursDataArray.filter(monthofhoursdata => {
                            const month = monthofhoursdata.monthandyear;
                            if (lastthreemonths.includes(month)) {
                                if (parseFloat(monthofhoursdata.out) > 0) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        // If results has some months in it, we need to include this bucket.
                        return results.length > 0;
                    });
                    if (bucketArrayFiltered.length > 0) {
                        filtered.push({
                            client: client,
                            bucketArrayFiltered: bucketArrayFiltered
                        });
                    }
                    return filtered;
                }, []);
                setBucketData(clientBuckets)
            }
        });
    }, [firebase, lastthreemonths]);

    if (clientData.length === 0) {
        return (
            <div>
                Loading client summary page
            </div>
        )
    }
    return (
        <div>
            <Container fluid>

                <table className="table">
                    <thead className="theat-dark">
                    <tr>
                        <th scope="col">Client</th>
                        <th scope="col">Bucket</th>
                        {lastthreemonths.map(month => {
                            return <th key={month} scope="col">{month}</th>
                        })}
                    </tr>
                    </thead>

                {clientData.map(bucketandclient => {
                    const bucketRender = bucketandclient.bucketArrayFiltered.map(bucket => {
                        const hoursDataArray = Object.keys(bucket.hoursData)
                            .map(key => ({
                                ...bucket.hoursData[key],
                                hoursID: key,
                            }));

                        const hoursToRender = hoursDataArray.sort((month1, month2) => {
                            const date1 = moment(month1.monthandyear, "MMM YYYY");
                            const date2 = moment(month2.monthandyear, "MMM YYYY");
                            return date1 - date2;
                        }).reduce((filtered, month) => {
                            if (lastthreemonths.includes(month.monthandyear)) {
                                filtered.push(month);
                            }
                            return filtered;
                        }, []);
                        return (<tr key={bucket.bucketID}>
                                        <td>{bucket.bucketName}</td>
                                                    {hoursToRender.map(hours => {
                                                        return (
                                                            <td key={hours.hoursID}>{hours.out}</td>
                                                        )
                                                    })}
                                    </tr>
                        );
                    });
                    return (
                        <tbody key={bucketandclient.client.clientID}>
                            <tr key={bucketandclient.client.clientID}>
                                <th rowSpan="5">{bucketandclient.client.name}</th>
                            </tr>
                            {bucketRender}
                        </tbody>
                    );
                })}
                </table>
            </Container>
        </div>
    );
};
// role-based authorization
const condition = authUser => {
    if (authUser.roles === undefined) {
        return false;
    }
    return authUser.roles[ROLES.BASIC] === ROLES.BASIC || authUser.roles[ROLES.ADMIN] === ROLES.ADMIN;
};
export default withAuthorization(condition)(SummaryPage);
