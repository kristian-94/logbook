import React from 'react';
import ReadOnlyBucket from "./ReadOnlyBucket";

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
            <button onClick={onBackToClientPage} className="btn btn-success m-1" type="submit">Back</button>
        </div>
    );
}
export default ArchivePage;
