import { auth, firestore, getUserWithUsername, googleAuthProvider, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from '../../components/PostContent';
import styles from '../../styles/Posts.module.css';
import MetaTags from '../../components/Metatags';

// Incremental Static Regeneration (ISR)
// Params contains the orute parameters for pages using dynamic [routes].
export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection('Posts').doc(slug);
    post = postToJSON(await postRef.get());
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

/*
! To detdermine which pages actually get rendered in advance
! We can tell next which paths to render by implementing getStaticPaths 
*/
export async function getStaticPaths() {
  // ! NOTES POSTS WITH A CAPITAL P
  const snapshot = await firestore.collectionGroup('Posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <MetaTags title={post.title} description={post.content} />
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
      </aside>
    </main>
  );
}
