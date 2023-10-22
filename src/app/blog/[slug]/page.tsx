import Link from 'next/link';
import Markdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import {mdComponents} from '@/app/blog/components/mdComponents';
import {
  getAllPosts,
  getPostBySlug,
  getSiblingPosts,
} from '@/app/blog/lib/posts';
import Arrow from '@/image/arrow.svg';
import Divider from '@/image/divider.svg';

export async function generateStaticParams() {
  return getAllPosts().map(({data: {slug}}) => ({slug}));
}

export default async function Post({params}: {params: {slug: string}}) {
  const {slug} = params;
  const post = getPostBySlug(slug);

  const {next, prev} = getSiblingPosts(slug);

  const footer = (
    <footer className="mb-8 flex flex-col items-center justify-center">
      <div className="font-serif text-3xl">read more?</div>
      <div className="flex flex-row gap-2">
        {prev && (
          <Link href={`/blog/${prev.data.slug}`}>
            <div className="group transition-all mb-2 py-2 hover:text-highlight hover:stroke-highlight">
              <div className="flex flex-row items-center relative">
                <Arrow className="absolute transition-transform right-full mr-3 w-[1.5em] h-[1.5em] group-hover:-translate-x-3 -scale-x-100" />
                <div className="font-sans">{prev.data.title}</div>
              </div>
            </div>
          </Link>
        )}
        {next && prev && <div className="py-2">•</div>}
        {next && (
          <Link href={`/blog/${next.data.slug}`}>
            <div className="group transition-all mb-2 py-2 hover:text-highlight hover:stroke-highlight">
              <div className="flex flex-row items-center relative">
                <div className="font-sans">{next.data.title}</div>
                <Arrow className="absolute transition-transform left-full ml-3 w-[1.5em] h-[1.5em] group-hover:translate-x-3" />
              </div>
            </div>
          </Link>
        )}
      </div>
    </footer>
  );

  return (
    <div className="flex flex-col items-center">
      <div>
        <div className="group transition-all mb-2 hover:text-highlight hover:stroke-highlight">
          <Link href="/blog">
            <div className="flex flex-row items-center relative">
              <Arrow className="absolute transition-transform right-full mr-4 w-[1.5em] h-[1.5em] group-hover:-translate-x-3 -scale-x-100" />
              <div className="font-serif">back to posts</div>
            </div>
          </Link>
        </div>
        <article className="prose max-w-[70ch] prose-brand !prose-invert prose-headings:font-serif prose-a:no-underline prose-a:prose-headings:text-brand-200">
          <Markdown
            components={mdComponents}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, {behavior: 'wrap'}],
            ]}
          >
            {post.content}
          </Markdown>
        </article>
        <div className="w-full flex mt-12 mb-10 justify-center">
          <Divider
            className="select-none w-40"
            alt="Decorative divider made of stars"
          />
        </div>
        {footer}
      </div>
    </div>
  );
}
