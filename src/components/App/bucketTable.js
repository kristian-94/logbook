import React, {useEffect, useState} from 'react';
import {useTable} from 'react-table';

const BucketTable = ({data, updateData, readOnly}) => {

    // Create an editable cell renderer
    const EditableCell = ({
                              value: initialValue,
                              row: { values },
                              column: { id },
                              updateMyData,
                          }) => {
        // We need to keep and update the state of the cell normally
        const [value, setValue] = useState(initialValue)
        const onChange = e => {
            setValue(e.target.value)
        }
        // We'll only update the external data when the input is blurred.
        const onBlur = () => updateMyData(values, id, value);
        // If the initialValue is changed external, sync it up with our state.
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])
        let width = '150px';
        if (id === 'in' || id === 'out') {
            width = '60px';
        }
        return <input value={value} onChange={onChange} onBlur={onBlur} style={{width: width}}/>
    }

    // Create a non editable cell renderer
    const NonEditableCell = ({cell}) => {
        if (!cell.value) {
            return null;
        }
        return cell.value;
    }

    // When rendering months, we convert the integer to the human readable month name.
    const NonEditableCellMonth = ({cell}) => {
        if (!cell.value) {
            return null;
        }
        return new Date(2020, cell.value - 1, 15).toLocaleString('default', {month: 'long'});
    }

    // Create an editable cell renderer
    const EditMultiline = ({
                               value: initialValue,
                               row: { values },
                               column: { id },
                               updateMyData,
                           }) => {
        // We need to keep and update the state of the cell normally
        const [value, setValue] = useState(initialValue)
        const onChange = e => {
            setValue(e.target.value)
        }
        // We'll only update the external data when the input is blurred
        const onBlur = () => updateMyData(values, id, value);
        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])
        return <textarea
            className="form-control"
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            placeholder="Write a description"
            style={{height: '2.5rem'}}
        />
    }

    // Set our editable cell renderer as the default Cell renderer
    const defaultColumn = {
        Cell: EditableCell,
        NonEditCell: NonEditableCell,
        NonEditCellMonth: NonEditableCellMonth,
        EditMultiline: EditMultiline,
    }

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (values, id, value) => {
        updateData(values, id, value);
    }
    const columns = React.useMemo(
        () => [
            {
                Header: 'Month',
                accessor: 'month',
            },
            {
                Header: 'Year',
                accessor: 'year',
            },
            {
                Header: 'Invoice',
                accessor: 'invoice',
            },
            {
                Header: 'Description',
                accessor: 'description',
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
                Header: 'Balance',
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
    } = useTable({
        columns,
        data,
        defaultColumn,
        updateMyData
    })

    return (
        <table {...getTableProps()} style={{ border: 'solid 1px black', width: '98%' }}>
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
                let rowColourTouchable = 'rowTouched';
                if (row.original.touched !== true) {
                    rowColourTouchable = 'rowNotTouched';
                }
                return (
                    <tr {...row.getRowProps()} className={rowColourTouchable}>
                        {row.cells.map(cell => {
                            if (cell.column.id === 'month') {
                                return (
                                    <td {...cell.getCellProps()} className="bucketcell">
                                        {cell.render('NonEditCellMonth')}
                                    </td>
                                );
                            }
                            if ((cell.column.id === 'year' || cell.column.id === 'remaining') || readOnly === true) {
                                return (
                                    <td {...cell.getCellProps()} className="bucketcell">
                                        {cell.render('NonEditCell')}
                                    </td>
                                );
                            }
                            if (cell.column.id === 'description') {
                                return (
                                    <td {...cell.getCellProps()} className="bucketcell" style={{width: '400px'}}>
                                        {cell.render('EditMultiline')}
                                    </td>
                                );
                            }
                            return (
                                <td {...cell.getCellProps()} className="bucketcell">
                                    {cell.render('Cell')}
                                </td>
                            );
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
}
export default BucketTable;
