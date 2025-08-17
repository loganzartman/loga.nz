import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  // Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      ['remark-frontmatter'],
      ['remark-mdx-frontmatter'],
      ['remark-gfm'],
    ],
    rehypePlugins: [
      ['rehype-highlight'],
      ['rehype-slug'],
      ['rehype-autolink-headings', {behavior: 'wrap'}],
    ],
  },
});

export default withMDX(nextConfig);
