import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {BACKEND_URL} from "../../constants/AppConstants";
import {getAuthConfig} from '../../store/actions/Clients';

const LogsPage = () => {
    const dispatch = useDispatch();
    const access_token = useSelector((state => state.auth.currentUser.access_token))
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Going to fetch the logs on each render of this page. No dispatch or redux state updated.
        const fetchLogs = async () => {
            const authconfig = getAuthConfig(access_token);
            const response = await axios.get(BACKEND_URL + 'logs', authconfig);
            console.log(response)
            if (response.status !== 200) {
                throw new Error('Didnt get 200 response when fetching users');
            }
            setLogs(response.data);
        }
        fetchLogs().then(() => console.log('fetched logs'));
    }, [dispatch, access_token]);

    if (logs.length === 0) {
        return (
            <div className="col-md-10 text-center">
                <h1>Loading logs...</h1>
            </div>
        );
    }
    return (
        <div className="text-center">
            <h1>Logs</h1>
            <table style={{width: '95%'}}>
                <thead>
                <tr style={{borderBottom: '1px solid black'}}>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Message</th>
                </tr>
                </thead>
                <tbody>
                {logs.map(log => {
                    return (
                        <tr className="text-left" key={log.id}>
                            <td>{log.date}</td>
                            <td>{log.category}</td>
                            <td>{log.message}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
export default (LogsPage);
