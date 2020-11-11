import React from 'react';
import ReadOnlyBucket from "./ReadOnlyBucket";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Tooltip from "rc-tooltip/es";

const ArchivePage = ({buckets, onBackToClientPage, clientID, restorable}) => {
    // TODO filter out non archived buckets here.
    return (
        <div>
            <h2>This is the archive page</h2>
            <div className="col-8">
                {buckets && buckets.map(bucket => {
                    if (bucket.archived === 1) {
                        return (
                            <div key={bucket.bucketID} className="singlebucket">
                                <ReadOnlyBucket bucket={bucket} clientID={clientID} buttons={restorable}/>
                                <hr/>
                            </div>
                        );
                    }
                    return null;
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
