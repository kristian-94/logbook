import React, {useEffect, useRef, useState} from 'react';
import {useTable} from 'react-table';
import moment from "moment";

const Bucket = ({clientID, bucket, firebase}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [bucketData, setBucketData] = useState({});
    const [hoursData, setHoursData] = useState(false);

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
    const onDeleteBucket = (clientID, bucketData) => {
        firebase.doDeleteBucket(clientID, bucketData).then(r => {
            console.log('deleted bucket ' + bucketData.bucketName);
        });
    }
    const data = React.useMemo(() => {
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
                    invoice: month.invoice
                }
            )
        });
    }, [hoursData]);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Month',
                accessor: 'month', // accessor is the "key" in the data
            },
            {
                Header: 'Invoice',
                accessor: 'invoice',
            },
            {
                Header: 'In',
                accessor: 'in',
            },
            {
                Header: 'Out',
                accessor: 'out',
            },
            {
                Header: 'Total left',
                accessor: 'remaining',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })

    return (
        <div>
            <div className='h5'>
                {bucketData.bucketName}
            </div>
            <button onClick={() => onAddMonth(clientID, bucketData)} className="btn btn-success m-1" type="submit">Add month</button>
            <button onClick={() => onRemoveMonth(clientID, bucketData)} className="btn btn-secondary m-1" type="submit">Remove last month</button>}
            <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps()}
                                style={{
                                    borderBottom: 'solid 3px red',
                                    background: 'aliceblue',
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <td
                                        {...cell.getCellProps()}
                                        style={{
                                            padding: '10px',
                                            border: 'solid 1px gray',
                                            background: 'papayawhip',
                                        }}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            <button onClick={() => onDeleteBucket(clientID, bucketData)} className="btn btn-danger m-1" type="submit">Delete bucket</button>
        </div>
    )
}
export default Bucket;
