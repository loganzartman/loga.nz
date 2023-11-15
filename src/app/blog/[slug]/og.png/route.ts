import {getAllPosts, getPostBySlug} from '@/app/blog/lib/posts';
import {generateOgImage} from '@/lib/generate-og-image';

export async function generateStaticParams() {
  return getAllPosts().map(({data: {slug}}) => ({slug}));
}

export async function GET(req: Request, {params}: {params: {slug: string}}) {
  const post = getPostBySlug(params.slug);
  return generateOgImage({title: post.data.title});
}
