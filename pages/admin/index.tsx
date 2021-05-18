import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import styles from '../../styles/Admin.module.css';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';
import { useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

//! All Admin pages are Client Rendered Only! bc admin is a private page and shouldnt be rendered on the server! (for security!)
export default function AdminPostsPage({}) {
  return (
    <main>
      {/* Any child that is inside Authcheck will now always know that the user has been authenticated! */}
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

// ! Returns html lists of posts
function PostList() {
  // Make a ref to users posts
  const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('Posts');

  // Sort Query by createdAt time
  const query = ref.orderBy('createdAt');

  // useCollection hook reads the query in realtime
  const [querySnapshot] = useCollection(query); //? Also research useColectionData() hook

  // map the snapshots document to its own document data
  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1> Manage your posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter(); // grab the router from hook

  const { username } = useContext(UserContext); // grab the username from context

  const [title, setTitle] = useState(''); // Use state to keep track of title form

  const slug = encodeURI(kebabCase(title)); // Keep track of slug as-a-kebab-string (encodeURI -> strips out any ?!/ chars)

  const isValid = title.length < 3 && title.length > 100; // Is a valid title if between 3 and 100 chars

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid; // Grab uid
    const ref = firestore.collection('users').doc(uid).collection('Posts').doc(slug); // Reference a new document with slug as its id

    const data = {
      title,
      slug,
      uid,
      username,
      published: true,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data); // Push it to firestore!
    toast.success('Post Created!');

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />

      <p>
        <strong>Slug: </strong>
        {slug}
      </p>

      {/* Button will signal form to call createPost function */}
      <button type="submit" disabled={isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
