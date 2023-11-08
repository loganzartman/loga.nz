import type {MDXComponents} from 'mdx/types';

import Admonition from '@/lib/components/Admonition';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Admonition,
  };
}
