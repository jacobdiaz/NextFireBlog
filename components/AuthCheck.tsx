// Only show ui if user is authenticated!
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

export default function AuthCheck(props) {
  const { username } = useContext(UserContext); // Pull out the username using the UserContext lib

  // If the username exsists
  return username ? props.children : props.fallback || <Link href="/enter">You must be signed in</Link>;
}


/*
Props.children is all the children that will be nested in <AuthCheck> tag
*/
