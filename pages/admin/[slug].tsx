import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AuthCheck from '../../components/AuthCheck';
import styles from '../../styles/Admin.module.css';
import ImageLoader from '../../components/ImageLoader';
export default function AdminPostEdit(params) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = router.query; // Grab the slug form the url params

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('Posts').doc(slug.toString()); // Ref to a users posts
  const [post] = useDocumentData(postRef); //Listen to post ref in real time!
  //? You can use useDocumentOnce to only listen once when the component is init

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>
          <aside>
            <h3>tools</h3>
            <button
              onClick={() => {
                setPreview(!preview);
              }}
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live View</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ postRef, defaultValues, preview }) {
  // Form takes in the data from firestore
  // and when ever a input value changes its going to rerender and revalidate the form
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

  // Update post will automatically have access to values in the form
  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    // Reset Form using built in function
    reset({ content, published });
    toast.success('Updated Successfully!');
  };

  return (
    // Note that handleSubmit is from react-hook-form, all we need to do is pass in a function for what should happen when submitted
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          {/* If we are in preview mode watch the content inside of the form and treat it like state */}
          {/* Render markdown to html if preview mode is on */}
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      {/* If we are not in preview mode show controls */}
      <div className={preview ? styles.hidden : styles.controls}>
        
        <ImageLoader/>
        
        {/* Setting the ref to register just tells react-hook-forms to include this text area to act like state */}
        <textarea name="content" {...register('content')}></textarea>

        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" {...register('published')} />
          <label>published</label>
        </fieldset>

        <button type="submit" className="btn-green">
          Save Changes
        </button>
      </div>
    </form>
  );
}
