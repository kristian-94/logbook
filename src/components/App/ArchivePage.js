import React from 'react';
import ReadOnlyBucket from "./ReadOnlyBucket";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Tooltip from "rc-tooltip/es";

const ArchivePage = ({archivedBucketsData, onBackToClientPage, clientID, firebase}) => {
    return (
        <div>
            <h2>This is the archive page</h2>
            <div className="col-8">
                {archivedBucketsData && archivedBucketsData.map(bucket => {
                    return (
                        <div key={bucket.bucketID} className="singlebucket">
                            <ReadOnlyBucket bucket={bucket} firebase={firebase} clientID={clientID}/>
                            <hr/>
                        </div>
                    );
                })}
            </div>
            <Tooltip
                placement="right"
                mouseEnterDelay={0.5}
                mouseLeaveDelay={0.1}
                trigger="hover"
                overlay={<div>Back to client page</div>}
            >
                <button onClick={onBackToClientPage} className="btn btn-success m-1" type="submit">
                    <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faArrowLeft} />
                </button>
            </Tooltip>
        </div>
    );
}
export default ArchivePage;
