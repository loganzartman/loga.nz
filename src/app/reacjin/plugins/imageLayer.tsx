import {LayerPlugin} from '@/app/reacjin/plugins/types';

export const imageLayerPlugin: LayerPlugin<
  {src: string},
  {image: ImageBitmap}
> = {
  compute: async ({src}) => {
    const data = await fetch(src, {credentials: 'omit'});
    const blob = await data.blob();
    const image = await createImageBitmap(blob);
    return {
      computed: {image},
      cleanup: () => image.close(),
    };
  },

  draw: ({ctx, computed: {image}}) => {
    ctx.drawImage(image, 0, 0);
  },
};
