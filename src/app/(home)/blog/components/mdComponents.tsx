import {MDXComponents} from 'mdx/types';

import StarOutline from '@/image/star-outline.svg';

export const mdComponents: MDXComponents = {
  h1({children, ...rest}) {
    return (
      <h1 {...rest} className="relative flex flex-row items-center">
        <StarOutline className="absolute right-full mr-1 md:mr-4 w-[0.8em] h-[0.8em] md:w-[1em] md:h-[1em] fill-brand-200 stroke-none" />
        {children}
      </h1>
    );
  },
  h2({children, ...rest}) {
    return (
      <h2 {...rest} className="relative flex flex-row items-center">
        <StarOutline className="absolute right-full mr-1 md:mr-4 w-[1em] h-[1em] fill-brand-200 stroke-none" />
        {children}
      </h2>
    );
  },
  h3({children, ...rest}) {
    return (
      <h3 {...rest} className="relative flex flex-row items-center">
        <StarOutline className="absolute right-full mr-1 md:mr-4 w-[1em] h-[1em] fill-brand-200 stroke-none" />
        {children}
      </h3>
    );
  },
};
