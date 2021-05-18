//#region imports
import React, { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../lib/context";
import { auth, googleAuthProvider, firestore } from "../lib/firebase";
import debounce from "lodash.debounce";
//#endregion

//! Enter Page
export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  console.log(`User: ${user}, Username: ${username}`);
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

//! Sign In With Google Button
function SignInButton(): any {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      Sign In With Google
    </button>
  );
}

//! Sign Out Button
function SignOutButton(): any {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

//! Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Create a batch of both the new userDoc and usernameDoc
    const batch = firestore.batch();

    // Set data to be commited for userdoc and usernamedoc
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    // Commit Both docs together
    await batch.commit();
  };

  // On change updates username variable to what is currently in the form
  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/; // is valid character

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // ! Listen to whenever form value is changing and check that username!
  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work because debounce would cause many rerenders
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("Firestore read executed!");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>
        </form>
      </section>
    )
  );
}

// Display if a username is available or not
function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success"> {username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger"> That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
