import {useLayoutEffect, useState} from 'react';

export const useElementSize = (
  ref: React.RefObject<Element>,
): [number, number] => {
  const [elementSize, setElementSize] = useState<[number, number]>([256, 256]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      const observer = new ResizeObserver((entries) => {
        const size = entries[0].devicePixelContentBoxSize[0];
        setElementSize([size.inlineSize, size.blockSize]);
      });
      observer.observe(el, {box: 'device-pixel-content-box'});
      return () => observer.unobserve(el);
    }
  }, [ref]);

  return elementSize;
};
