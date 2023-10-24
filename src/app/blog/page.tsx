import Link from 'next/link';

import {getAllPosts, Post} from '@/app/blog/lib/posts';
import CatLeft from '@/image/cat-left.svg';

function PostListing({post}: {post: Post}) {
  const tags = post.data.tags && (
    <div className="flex flex-row gap-2 my-1 text-sm">
      {post.data.tags.map((tag: string) => (
        <div
          key={tag}
          className="bg-brand-100/20 hover:bg-highlight/20 hover:text-highlight px-2 py-0.5 rounded-sm"
        >
          {tag}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Link href={`/blog/${post.data.slug}`} className="group transition-all">
        <div
          key={post.data.slug}
          className="flex flex-col transition-colors group-hover:text-highlight group-hover:stroke-highlight"
        >
          <div className={`font-semibold text-2xl`}>{post.data.title}</div>
          {post.data.description && <div>{post.data.description}</div>}
        </div>
      </Link>
      {tags}
      <div className="transition-colors text-brand-300 group-hover:text-highlight">
        {post.data.date.toLocaleDateString()}
      </div>
    </div>
  );
}

export default async function Blog() {
  const postListings = getAllPosts().map((post) => (
    <PostListing key={post.data.slug} post={post} />
  ));

  return (
    <div className="max-w-[60ch] flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="font-serif text-5xl">posts on my blog:</h1>
      </div>
      {postListings}
      <div className="fixed bottom-2 right-[15%]">
        <CatLeft
          alt="A laying cat looking upwards toward the text, rendered in a minimal line-drawing style"
          className="select-none w-[calc(min(180px,max(100px,10vmax)))] h-auto"
        />
      </div>
    </div>
  );
}
