import * as firebase from 'firebase';
import { firebaseConfig } from './env.local';

const config = {
  projectId: firebaseConfig.projectId,
  apiKey: firebaseConfig.apiKey,
  databaseURL: firebaseConfig.databaseURL,
};

firebase.initializeApp(config);

export default firebase;
