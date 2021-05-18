import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

//Creates a new timestamp from the given number of milliseconds.
export const fromMillis = firebase.firestore.Timestamp.fromMillis;

//Creates a new timestamp from the server clock
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

const firebaseConfig = {
  apiKey: 'AIzaSyDvVc1r4_Umje4hrCgBcUU1oKwwlyttSvQ',
  authDomain: 'nextfire-e76f3.firebaseapp.com',
  projectId: 'nextfire-e76f3',
  storageBucket: 'nextfire-e76f3.appspot.com',
  messagingSenderId: '503281491360',
  appId: '1:503281491360:web:f52d9f538d869500a7d8c5',
  measurementId: 'G-1B0SBF3RG0',
};

// Only initialize the apps once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export firebase servicese
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
//! Query for target user document from a given username
export async function getUserWithUsername(username) {
  // Query firestore into a given user
  const userRef = firestore.collection('users');
  const query = userRef.where('username', '==', username).limit(1); // Limit(1) -> returnt he first hit where we find the target username

  const userDoc = (await query.get()).docs[0]; // Grab the first document in that returned array
  return userDoc; // return the reference to the target user document
}

//! Convert a firestore document to JSON
/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
