import React, { useEffect, useMemo, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as clientActions from '../../store/actions/Clients';
import * as authActions from '../../store/actions/Auth';
import { useSortBy, useTable } from 'react-table';

const OwnerPage = () => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const clients = useSelector(state => state.clients.clients);
  const adminUsers = useSelector(state => state.auth.adminUsers);
  const dispatch = useDispatch();

  // Need this to do a componentwillunmount and cleanup memory leaks.
  useEffect(() => {
    // ComponentWillUnmount in Class Component
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    dispatch(clientActions.fetchClients());
    dispatch(authActions.fetchUsers());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: 'Client',
        accessor: 'client',
      },
      {
        Header: 'Owner',
        accessor: 'owner',
      },
    ],
    []
  );
  // Makes the sorting consistent.
  const capitalizeFirstLetter = (uncapitalString) => uncapitalString.charAt(0).toUpperCase() + uncapitalString.slice(1);
  const data = useMemo(() => {
    // Grab data and format as array and output here.
    return clients.map((client) => {
      const owner = adminUsers.filter(user => user.id === client.ownerid);
      let ownername = 'No owner';
      if (Object.keys(owner).length > 0) {
        ownername = owner[0].username;
      }

      return (
        {
          client: capitalizeFirstLetter(client.name),
          owner: capitalizeFirstLetter(ownername),
        }
      );
    });
  }, [clients, adminUsers]);

  // Create a non editable cell renderer
  const NonEditableCell = ({ cell }) => {
    if (!cell.value) {
      return null;
    }

    return cell.value;
  };
  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: NonEditableCell,
  };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useSortBy
  );

  if (clients.length === 0 || adminUsers.length === 0) {
    return (
      <div>
        Loading client owners page
      </div>
    );
  }

  return (
    <div>
      <Container fluid>
        <table {...getTableProps()} className="table w-50">
          <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                                        {column.isSorted
                                          ? column.isSortedDesc
                                            ? ' ⬇️'
                                            : ' ⬆️'
                                          : ''}
                                      </span>
                </th>

              ))}
            </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
          </tbody>
        </table>
      </Container>
    </div>
  );
};

export default OwnerPage;
