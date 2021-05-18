// Installed npm i react-markdown

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

//! Used in /[username]/index.js to render post content
export default function PostContent({ post }) {
  // If createdAt is in a numebr format convert it to a js Date otherwise use the firestore timestamp to convert to a date
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div>
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written By
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>

      {/* Content is the stuff we've saved on firestore which is in markdown format but gets converted to html fort the end user*/}
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}
