import * as firebase from 'firebase';
import {firebaseConfig} from '.env.local'

const settings = {timestampsInSnapshots: true};

const config = {
    projectId: firebaseConfig.projectId,
    apiKey: firebaseConfig.apiKey,
    databaseURL: firebaseConfig.databaseURL
};

firebase.initializeApp(config);
firebase.firestore().settings(settings);

export default firebase;