import React, {useEffect, useState} from 'react';
import AddBucketForm from "./AddBucketForm";

const SingleClientPage = ({clientID}) => {
    const [addingNewBucket, setAddingNewBucket] = useState(false);
    const [displayMessage, setDisplayMessage] = useState("No bucket saved yet, fill out the form above.");

    useEffect(() => {setAddingNewBucket(false)}, [clientID]);
    const onCreateBucket = () => {
        setAddingNewBucket(true);
    }

    const handleOnFinishSubmission = (finishMessage) => {
        setDisplayMessage(finishMessage);
        setAddingNewBucket(false);
    }
    const onBackToClientPage = () => {
        setAddingNewBucket(false);
    }

    if (addingNewBucket) {
        return (
            <div className="w-75">
                <AddBucketForm cancelForm={onBackToClientPage} clientID={clientID} onFinishSubmission={handleOnFinishSubmission}/>
                <p>{displayMessage}</p>
            </div>
        );
    }

    return (
        <div>
            <div>this is a client page. we will display all the buckets here plus buttons to add a bucket</div>
            <button onClick={onCreateBucket} className="btn btn-primary m-1" type="submit">Create a bucket</button>
        </div>
    );
}
export default SingleClientPage;
