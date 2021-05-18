import Link from "next/link";

// Adimin boolean allows you to dictate whether or not we can edit the post as an admin
export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin }): any {
  const wordCount = post?.content.trim();
  const minuteToRead = (wordCount / 100 + 1).toFixed(0);
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
        <span>
          {wordCount} words. {minuteToRead} min read
        </span>
        <span> 💗 {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
}
