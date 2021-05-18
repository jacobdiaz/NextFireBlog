//#region Imports
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";
//! useAuthState listens to current user. If signed out returns null else returns the useObject from firebase
// Wraps all pages
import { GetServerSideProps } from "next";
import { useUserData } from "../lib/hooks";
//#endregion

function MyApp({ Component, pageProps }) {
  // userData is a custom hook that handles getting the user data when signed in!
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
