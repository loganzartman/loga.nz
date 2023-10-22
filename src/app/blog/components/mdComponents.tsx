import {Components} from 'react-markdown';

import StarOutline from '@/lib/components/StarOutline';

export const mdComponents: Components = {
  h1({children, ...rest}) {
    return (
      <h1 {...rest} className="relative flex flex-row items-center">
        <StarOutline className="absolute right-full mr-4 w-[1em] h-[1em] fill-brand-200 stroke-none" />
        {children}
      </h1>
    );
  },
  h2({children, ...rest}) {
    return (
      <h2 {...rest} className="relative flex flex-row items-center">
        <StarOutline className="absolute right-full mr-4 w-[1em] h-[1em] fill-brand-200 stroke-none" />
        {children}
      </h2>
    );
  },
  h3({children, ...rest}) {
    return (
      <h3 {...rest} className="relative flex flex-row items-center">
        <StarOutline className="absolute right-full mr-4 w-[1em] h-[1em] fill-brand-200 stroke-none" />
        {children}
      </h3>
    );
  },
};
