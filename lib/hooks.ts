import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../lib/firebase";

export function useUserData(){
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null); // Initalize usename in state as null
  
    //#region Whats happening in useEffect()
    /*
      Listen to any changes to user if they log in or not. If they do log in
      probe the users collection and look for their uid. Then set the username base on the uid.
      Call unsubscribe at the end and if there was a user set the username.
    */
    //#endregion
    useEffect(() => {
      let unsubscribe;
      if (user) {
        const ref = firestore.collection("users").doc(user.uid);
        unsubscribe = ref.onSnapshot((doc) => {
          setUsername(doc.data()?.username);
        });
      } else {
        setUsername(null);
      }
      return unsubscribe;
    }, [user]);
  
    return {user, username}
}