import React, {useEffect, useRef, useState} from 'react';
import {useTable} from 'react-table';
import moment from "moment";

const Bucket = ({clientID, bucket, firebase}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [bucketData, setBucketData] = useState({});
    const [hoursData, setHoursData] = useState({});

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
                if (hoursData === false) {
                    // No hours for this client yet.
                    return;
                }
                setHoursData(hoursData);
            }
        });
    }, [bucket, firebase, clientID]);

    const onAddMonth = (clientID, bucketData) => {
        // Check existing hoursData first, what is our current month we have? Need to append the next month.
        const currentmonthandyear = moment().format('MMM YYYY');
        firebase.doAddMonth(clientID, bucketData, currentmonthandyear);
    }

    const data = React.useMemo(() => {
        // Grab hoursData and format as array and output here.
        console.log(hoursData);
        return [
            {
                month: bucketData.bucketName,
                invoice: 'World',
            },
            {
                month: 'react-table',
                invoice: 'rocks',
            },
            {
                month: 'whatever',
                invoice: 'you want',
            },
        ];
    }, [bucketData]);

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
        </div>
    )
}
export default Bucket;
