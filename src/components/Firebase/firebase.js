import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import uuid from 'react-uuid'



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
    doUpdateClient = (clientID, name) => {
        return this.client(clientID).set({
            name,
        });
    };
    doDeleteClient = (clientID) => {
        return this.client(clientID).remove();
    }

    // Buckets API - buckets have time created, name.
    bucket = (clientID, bucketID) => this.db.ref(`clients/${clientID}/buckets/${bucketID}`);
    buckets = (clientID) => this.db.ref(`clients/${clientID}/buckets`);
    doStoreBucket = (bucketName, timeCreated, clientID) => {
        return this.bucket(clientID, uuid()).set({
            bucketName,
            timeCreated,
        });
    };

}
export default Firebase;

