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
import Date from '@/lib/components/Date';

export async function generateStaticParams() {
  return getAllPosts().map(({data: {slug}}) => ({slug}));
}

function Footer({slug}: {slug: string}) {
  const {next, prev} = getSiblingPosts(slug);

  return (
    <footer className="mb-8 flex flex-col items-center justify-center">
      <div className="font-serif text-3xl mb-4">read more?</div>
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

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-full">
        <div className="group transition-all mb-2 hover:text-highlight hover:stroke-highlight">
          <Link href="/blog">
            <div className="flex flex-row items-center relative">
              <Arrow className="absolute transition-transform right-full mr-1 md:mr-4 w-[1.5em] h-[1.5em] group-hover:-translate-x-3 -scale-x-100" />
              <div className="font-serif">back to posts</div>
            </div>
          </Link>
        </div>
        <Date date={post.data.date} className="text-brand-300" />
        <article className="prose max-w-[72ch] prose-brand !prose-invert prose-headings:font-serif prose-a:no-underline prose-a:prose-headings:text-brand-200 prose-pre:-mx-8 prose-pre:p-0 md:prose-pre:mx-0 md:prose-pre:p-2">
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
        <div className="flex mt-12 mb-10 justify-center">
          <Divider
            className="select-none w-40"
            alt="Decorative divider made of stars"
          />
        </div>
        <Footer slug={slug} />
      </div>
    </div>
  );
}
