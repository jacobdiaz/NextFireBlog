import { useDocument } from 'react-firebase-hooks/firestore';
import { firestore, auth, increment } from '../lib/firebase';

export default function HeartButton({ postRef }) {
  // Create a reference to a new hearts documnent with a uid as the id
  const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef); // Listen to the heartRef document

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch(); //updating two documents at the same time!

    batch.update(postRef, { heartCount: increment(1) }); // Update the postRef
    batch.set(heartRef, { uid }); // Update heart ref

    await batch.commit(); // Send the writes to the database
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  // If there exsists a document with the uid we know the current user has already like the post
  return heartDoc?.exists ? <button onClick={removeHeart}>💔 Unheart</button> : <button onClick={addHeart}>💗 Heart</button>;
}
