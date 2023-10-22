import Image from 'next/image';
import Link from 'next/link';

import imgCatLeft from '@/app/blog/cat-left.svg';
import {getAllPosts, Post} from '@/app/blog/lib/posts';

function PostListing({post}: {post: Post}) {
  const tags = post.data.tags && (
    <div className="flex flex-row gap-2 my-1 text-sm">
      {post.data.tags.map((tag: string) => (
        <div key={tag} className="bg-brand-100/20 px-2 rounded-sm">
          {tag}
        </div>
      ))}
    </div>
  );

  return (
    <Link href={`/blog/${post.data.slug}`} className="group transition-all">
      <div
        key={post.data.slug}
        className="flex flex-col transition-colors group-hover:text-highlight group-hover:stroke-highlight"
      >
        <div className={`font-semibold text-2xl`}>{post.data.title}</div>
        {post.data.description && <div>{post.data.description}</div>}
        {tags}
        <div className="transition-colors text-brand-300 group-hover:text-highlight">
          {post.data.date.toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}

export default async function Blog() {
  const postListings = getAllPosts().map((post) => (
    <PostListing key={post.data.slug} post={post} />
  ));

  return (
    <div className="w-[60ch] max-w-full flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="font-serif text-5xl">posts on my blog:</h1>
      </div>
      {postListings}
      <div className="fixed bottom-2 right-[15%]">
        <Image
          src={imgCatLeft}
          alt="A laying cat looking upwards toward the text, rendered in a minimal line-drawing style"
          className="select-none w-[calc(min(180px,max(100px,10vmax)))]"
        />
      </div>
    </div>
  );
}
