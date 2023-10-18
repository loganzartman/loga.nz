import Link from 'next/link';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import {getAllPosts, getPostBySlug} from '@/app/blog/lib/posts';
import Arrow from '@/lib/components/Arrow';

export async function generateStaticParams() {
  return getAllPosts().map(({data: {slug}}) => ({slug}));
}

export default async function Post({params}: {params: {slug: string}}) {
  const {slug} = params;
  const post = getPostBySlug(slug);
  return (
    <div className="flex flex-col items-center mt-8">
      <div className="prose prose-invert prose-headings:font-serif">
        <div className="not-prose group transition-all -ml-4 mb-2 hover:text-highlight hover:stroke-highlight">
          <Link href="/blog">
            <div className="flex flex-row items-center">
              <Arrow className="transition-transform h-[1.5em] group-hover:-translate-x-3 -scale-x-100" />
              <div className="font-serif">back to posts</div>
            </div>
          </Link>
        </div>
        <article>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </Markdown>
        </article>
      </div>
    </div>
  );
}