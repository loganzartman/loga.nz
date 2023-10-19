import Image from 'next/image';

import imgCatLeft from '@/app/blog/cat-left.svg';
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
      <div className="w-[60ch] max-w-full flex flex-col gap-4">
        <div className="mb-4">
          <h1 className="font-serif text-5xl">posts on my blog:</h1>
          <aside className="mt-2 font-sans text-sm">
            &ldquo;blog&rdquo; is short for &ldquo;i neglect this web-log&rdquo;
          </aside>
        </div>
        {postListings}
      </div>
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
