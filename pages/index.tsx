import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import PostFeed from '../components/PostFeed';
import { firestore, fromMillis, postToJSON } from '../lib/firebase';
import { useState } from 'react';

// Max posts to query per paginated batch
const LIMIT = 10;

// Server side render the post data
export async function getServerSideProps(context) {
  // Get all subcollections with the name posts
  const postsQuery = firestore.collectionGroup('Posts').where('published', '==', true).orderBy('createdAt', 'desc').limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON); // For each post perform the postTOJson function
  return { props: { posts } }; // will be passed to he page component as props
}

// Props gets passed into the Home component from the serverSide function
export default function Home(props) {
  const [posts, setPosts] = useState(props.posts); // inital value of posts is just the props rendered on the server
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false); // used to tell use when we've reached the end of a posts lists

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    // if createdAt is a number convert it to a millis else just use the exsisting time stamp
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    // This Query starts after the last document in the posts list
    const query = firestore
      .collectionGroup('Posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    // Fetch data and map each individual document to it's document data
    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    // Concatonate new posts to exsisting posts
    setPosts(posts.concat(newPosts));

    //If no more posts
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
    setLoading(false);
  };

  return (
    <main>
      <PostFeed posts={posts} admin={false} />

      {/* If not loading and not at the PostsEnd */}
      {!loading && !postsEnd && <button onClick={getMorePosts}>Load More</button>}
      {loading ? <Loader show="loading" /> : null}

      {/* If no more posts */}
      {postsEnd && 'You have reached the end!'}
    </main>
  );
}
