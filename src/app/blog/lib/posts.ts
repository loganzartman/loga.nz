import fs from 'fs';
import matter from 'gray-matter';
import {join} from 'path';

const postsDirectory = join(process.cwd(), 'src/app/blog/posts');

export type Post = {
  content: string;
  data: {
    [key: string]: any;
    slug: string;
    date: Date;
  };
};

export function getPostPaths() {
  return fs.readdirSync(postsDirectory);
}

export function getPostByPath(path: string): Post {
  return getPostBySlug(path.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string): Post {
  const path = `${slug}.md`;
  const fullPath = join(postsDirectory, path);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const {content, data} = matter(fileContents);

  const date = new Date(data.date);
  if (isNaN(date.getTime()))
    throw new Error(`Post '${slug}' has invalid date: ${data.date}`);

  return {
    content,
    data: {...data, slug, date},
  };
}

export function getSiblingPosts(slug: string): {
  next: Post | undefined;
  prev: Post | undefined;
} {
  const posts = getAllPosts().sort(
    (a, b) => a.data.date.getTime() - b.data.date.getTime(),
  );
  const index = posts.findIndex((post) => post.data.slug === slug);
  const prev = index > 0 ? posts[index - 1] : undefined;
  const next = index < posts.length - 1 ? posts[index + 1] : undefined;
  return {prev, next};
}

export function getAllPosts(): Post[] {
  const paths = getPostPaths();
  const posts = paths
    .map((path) => getPostByPath(path))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.data.date > post2.data.date ? -1 : 1));
  return posts;
}
