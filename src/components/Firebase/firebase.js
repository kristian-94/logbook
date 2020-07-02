import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import uuid from 'react-uuid'
import moment from "moment";

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
    }
    // *** Auth API ***
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);
    // *** Merge Auth and DB User API *** //
    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val();
                        // default empty roles
                        if (!dbUser.roles) {
                            dbUser.roles = {};
                        }
                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser,
                        };
                        next(authUser);
                    });
            } else {
                fallback();
            }
        });

    // *** User API ***
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    // *** Client API ***
    client = id => this.db.ref(`clients/${id}`);
    clients = () => this.db.ref('clients');

    doStoreClient = (name) => {
        return this.client(uuid()).set({
            name,
        });
    };
    doUpdateClient = (clientID, name, monthlysupport, owner) => {
        return this.client(clientID).update({
            name,
            monthlysupport,
            owner
        });
    };
    doUpdateClientNote = (clientID, noteData) => {
        return this.client(clientID).update({
            noteData,
        });
    };
    doDeleteClient = (clientID) => {
        return this.client(clientID).remove();
    }
    // Communications
    comms = (clientID) => this.db.ref(`clients/${clientID}/communcations`);
    comm = (clientID, commsID) => this.db.ref(`clients/${clientID}/communcations/${commsID}`);
    doStoreComm = (clientID, note, date) => {
        return this.comm(clientID, uuid()).set({
            note,
            date,
        });
    };
    doDeleteComm = (clientID, id) => {
        return this.comm(clientID, id).remove();
    };

    // Buckets API - buckets have time created, name.
    bucket = (clientID, bucketID) => this.db.ref(`clients/${clientID}/buckets/${bucketID}`);
    buckets = (clientID) => this.db.ref(`clients/${clientID}/buckets`);
    doStoreBucket = (bucketName, timeCreated, clientID) => {
        return this.bucket(clientID, uuid()).set({
            bucketName,
            timeCreated,
            archived: false,
            'hoursData': false
        });
    };
    doUpdateBucket = (clientID, bucketData, newName) => {
        return this.bucket(clientID, bucketData.bucketID).update({
            bucketName: newName
        });
    };
    doDeleteBucket = (clientID, bucketData) => {
        return this.bucket(clientID, bucketData.bucketID).remove();
    };
    doArchiveBucket = (clientID, bucketData) => {
        return this.bucket(clientID, bucketData.bucketID).update({
            archived: true
        });
    };
    doUnArchiveBucket = (clientID, bucketData) => {
        return this.bucket(clientID, bucketData.bucketID).update({
            archived: false
        });
    };
    hoursData = (clientID, bucketData) => this.db.ref(`clients/${clientID}/buckets/${bucketData.bucketID}/hoursData`);
    monthOfHours = (clientID, bucketData, monthID) => this.db.ref(`clients/${clientID}/buckets/${bucketData.bucketID}/hoursData/${monthID}`);
    monthRemaining = (clientID, bucketData, monthID) => this.db.ref(`clients/${clientID}/buckets/${bucketData.bucketID}/hoursData/${monthID}/remaining`);

    doUpdateHoursData = (clientID, bucketData, monthID, newHoursData) => {
        newHoursData.touched = true; // We set touched to true whenever we do any bucket update.
        this.monthOfHours(clientID, bucketData, monthID).update(newHoursData).then(r => console.log('updated hours data'));
        // We also need to update the 'total left' column here.
        this.recalculateTotalLeftData(clientID, bucketData);
    }

    recalculateTotalLeftData = (clientID, bucketData) => {
        // Get the hoursData from the bucket in firebase.
        this.hoursData(clientID, bucketData).once(('value')).then(snapshot => {
            const hoursData = snapshot.val();
            const hoursDataFormatted = Object.keys(hoursData)
                .map(key => ({
                    ...hoursData[key],
                    monthID: key,
                })).sort((month1, month2) => {
                    // We want to sort the dates in ascending order.
                    const date1 = moment(month1.monthandyear, 'MMM YYYY');
                    const date2 = moment(month2.monthandyear, 'MMM YYYY');
                    return date1 - date2;
                });
            // Loop through and calculate and update the remaining value line by line.
            let previousTotal = 0;
            hoursDataFormatted.map(monthData => {
                // Round to 1 decimal place.
                const newRemaining = Math.round(((monthData.in - monthData.out + previousTotal) * 10 ))  / 10;
                this.monthRemaining(clientID, bucketData, monthData.monthID).set(newRemaining).then(r => console.log('updated time remaining'));
                previousTotal = newRemaining;
                return true;
            });
        });
    }

    // Add an empty month into a bucket.
    doAddMonth = (clientID, bucketData, monthandyear) => {
        return this.hoursData(clientID, bucketData).push({
            in: 0,
            out: 0,
            remaining: 0,
            touched: false,
            invoice: '',
            description: '',
            monthandyear: monthandyear
        });
    };
    doRemoveMonth = (clientID, bucketData, monthID) => {
        return this.monthOfHours(clientID, bucketData, monthID).remove();
    };

}
export default Firebase;

