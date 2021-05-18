import Link from 'next/link';
import { firestore, auth, serverTimestamp } from '../lib/firebase';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Adimin boolean allows you to dictate whether or not we can edit the post as an admin
export default function PostFeed({ posts, admin }) {
  return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post, admin }): any {
  const { username } = useContext(UserContext); // grab the username from context
  const slug = post.slug;
  const uid = auth.currentUser.uid; // Grab uid
  const ref = firestore.collection('users').doc(uid).collection('Posts').doc(slug); // Reference a new document with slug as its id

  const deletePost = () => {
    ref.delete();
  };

  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount.length / 100 + 1).toFixed(0);
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>
      <footer>
        {wordCount} words. {minutesToRead} min read
        <span> 💗 {post.heartCount} Hearts</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          <h3>
            <button className="btn-green" onClick={deletePost}>
              delete
            </button>
          </h3>
          {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
        </>
      )}
    </div>
  );
}
