import {getAllPosts, getPostBySlug} from '@/app/(home)/blog/lib/posts';
import {generateOgImage} from '@/lib/generate-og-image';

export async function generateStaticParams() {
  return getAllPosts().map(({data: {slug}}) => ({slug}));
}

export async function GET(
  req: Request,
  props: {params: Promise<{slug: string}>},
) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);
  return generateOgImage({title: post.data.title});
}
