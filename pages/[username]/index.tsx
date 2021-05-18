import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import MetaTags from '../../components/Metatags';

//! Server Side Render the data
export async function getServerSideProps({ query }) {
  // get username from query Object of the url
  const { username } = query;

  // Query into firestore user collection and retrieves the user document
  const userDoc = await getUserWithUsername(username);

  // JSON serializable data
  let user = null;
  let posts = null;

  // If the userDoc exsists
  if (userDoc) {
    user = userDoc.data(); //get Document data

    const postQuery = userDoc.ref.collection('Posts').where('published', '==', true).orderBy('createdAt', 'desc').limit(5);

    // Execute the query
    posts = await (await postQuery.get()).docs.map(postToJSON);
  }

  // 404 if there isnt a url with that username
  if (!userDoc) {
    return {
      notFound: true, // Not found is built in to next and will load file called 404 in the root pages directory!
    };
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  );
}
