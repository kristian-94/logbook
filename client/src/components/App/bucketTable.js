import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const BucketTable = ({ data, updateData, onRemoveMonth, readOnly }) => {
  // Create an editable cell renderer
  const EditableCell = ({
                          value: initialValue,
                          row: { values },
                          column: { id },
                          updateMyData,
                        }) => {
    if (initialValue === null) {
      initialValue = '';
    }

    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);
    const onChange = e => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred.
    const onBlur = () => updateMyData(values, id, value);

    // If the initialValue is changed external, sync it up with our state.
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    let width = '150px';
    if (id === 'in' || id === 'out') {
      width = '60px';
    }

    return <input value={value} onChange={onChange} onBlur={onBlur} style={{ width: width }}/>;
  };

  // Create a non editable cell renderer
  const NonEditableCell = ({ cell }) => {
    if (cell.value !== 0 && !cell.value) {
      return null;
    }

    if (cell.column.id === 'remaining' && cell.value % 1 !== 0) {
      // Make sure the remaining column only displays values to 2 decimal places maximum.
      return cell.value.toFixed(2);
    }

    return cell.value;
  };

  // When rendering months, we convert the integer to the human readable month name.
  const NonEditableCellMonth = ({ cell }) => {
    if (!cell.value) {
      return null;
    }

    return new Date(2020, cell.value - 1, 15).toLocaleString('default', { month: 'long' });
  };

  // Create an editable cell renderer
  const EditMultiline = ({
                           value: initialValue,
                           row: { values },
                           column: { id },
                           updateMyData,
                         }) => {
    // We need to keep and update the state of the cell normally
    if (initialValue === null) {
      initialValue = '';
    }

    const [value, setValue] = useState(initialValue);
    const onChange = e => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => updateMyData(values, id, value);

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    return <textarea
      className="form-control"
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      placeholder="Write a description"
      style={{ height: '2.5rem' }}
    />;
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
    NonEditCell: NonEditableCell,
    NonEditCellMonth: NonEditableCellMonth,
    EditMultiline: EditMultiline,
  };

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (values, column, value) => {
    const currentmonth = data.filter(hour => (hour.month === values.month && hour.year === values.year))[0];
    if (currentmonth === undefined || !currentmonth) {
      console.log('trying to update a month that could not be found! - this should not be possible!');
      return;
    }

    if (currentmonth[column] === value || (value === '' && currentmonth[column] === null)) {
      console.log('no need to update, nothing changed');
      return;
    }

    updateData(currentmonth.id, column, value);
  };

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
    updateMyData,
  });
  const styleTable = {
    borderBottom: 'solid 3px red',
    background: 'aliceblue',
    color: 'black',
    fontWeight: 'bold',
  };

  return (
    <table {...getTableProps()} style={{ border: 'solid 1px black', width: '98%' }}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th
              {...column.getHeaderProps()}
              style={styleTable}
            >
              {column.render('Header')}
            </th>
          ))}
          {!readOnly && <th style={styleTable}>Action</th>}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map(row => {
        prepareRow(row);
        let rowColourTouchable = 'rowTouched';
        if (row.original.touched !== 1) {
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
                  <td {...cell.getCellProps()} className="bucketcell" style={{ width: '400px' }}>
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
            {!readOnly && rows.length > 1 && <td>
              <button onClick={() => onRemoveMonth(row.original)} className="btn btn-secondary m-1" type="submit">
                <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={faTrash}/>
              </button>
            </td>}
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};

export default BucketTable;
