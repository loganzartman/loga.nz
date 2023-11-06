import dynamic from 'next/dynamic';
import Link from 'next/link';

import {createDiscussionHref} from '@/app/blog/lib/discussions';
import {
  getAllPosts,
  getPathBySlug,
  getPostBySlug,
  getSiblingPosts,
  Post,
} from '@/app/blog/lib/posts';
import Arrow from '@/image/arrow.svg';
import Divider from '@/image/divider.svg';
import Date from '@/lib/components/Date';

export async function generateStaticParams() {
  return getAllPosts().map(({data: {slug}}) => ({slug}));
}

async function Footer({post}: {post: Post}) {
  const {next, prev} = getSiblingPosts(post.data.slug);
  const discussionHref = await createDiscussionHref(post);

  return (
    <footer className="mb-8 flex flex-col items-center justify-center">
      <a
        href={discussionHref}
        className="px-3 py-2 rounded-full ring-1 ring-brand-200 transition-all hover:ring-highlight hover:text-highlight"
      >
        discuss this post
      </a>
      <div className="font-serif text-3xl mt-10 mb-2">read more?</div>
      <div className="flex flex-col items-center gap-2 my-2">
        {next && (
          <Link href={`/blog/${next.data.slug}`}>
            <div className="group transition-all hover:text-highlight hover:stroke-highlight">
              <div className="flex flex-row items-center relative">
                <div className="font-sans text-right">{next.data.title}</div>
                <Arrow className="absolute transition-transform left-full ml-2 w-[1.5em] h-[1.5em] group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
        )}
        {prev && (
          <Link href={`/blog/${prev.data.slug}`}>
            <div className="group transition-all hover:text-highlight hover:stroke-highlight">
              <div className="flex flex-row items-center relative">
                <Arrow className="absolute transition-transform right-full mr-2 w-[1.5em] h-[1.5em] group-hover:-translate-x-2 -scale-x-100" />
                <div className="font-sans text-left">{prev.data.title}</div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </footer>
  );
}

export default async function Post({params}: {params: {slug: string}}) {
  const {slug} = params;
  const post = getPostBySlug(slug);
  const Post = dynamic(() => import(`../posts/${getPathBySlug(slug)}`));

  return (
    <div className="flex flex-col items-center -mt-2">
      <div className="max-w-full">
        <Date date={post.data.date} className="text-brand-300" />
        <article className="prose max-w-[72ch] prose-brand !prose-invert prose-headings:font-serif prose-a:no-underline prose-a:prose-headings:text-brand-200 prose-pre:-mx-8 prose-pre:p-0 md:prose-pre:mx-0 md:prose-pre:p-2">
          <Post />
        </article>
        <div className="flex mt-12 mb-10 justify-center">
          <Divider
            className="select-none w-40"
            alt="Decorative divider made of stars"
          />
        </div>
        <Footer post={post} />
      </div>
    </div>
  );
}
