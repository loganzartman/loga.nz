import {getAllPosts, Post} from '@/app/blog/lib/posts';

function PostListing({post}: {post: Post}) {
  return (
    <a
      href={`/blog/${post.data.slug}`}
      className="hover:text-highlight hover:stroke-highlight"
    >
      <div key={post.data.slug}>
        <div className={`font-semibold text-2xl`}>{post.data.title}</div>
        <div>{post.data.date.toLocaleDateString()}</div>
      </div>
    </a>
  );
}

export default async function Blog() {
  const postListings = getAllPosts().map((post) => (
    <PostListing key={post.data.slug} post={post} />
  ));

  return (
    <div className="w-full flex justify-center mt-12">
      <div className="max-w-[60ch] flex flex-col gap-4">
        <div className="font-display text-5xl mb-4">posts on my blog:</div>
        {postListings}
      </div>
    </div>
  );
}
