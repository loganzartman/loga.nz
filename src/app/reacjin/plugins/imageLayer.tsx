import {PanelRow} from '@/app/reacjin/PanelRow';
import {LayerPlugin} from '@/app/reacjin/plugins/types';

export type ImageLayerOptions = {
  src: string;
};

export type ImageLayerComputed = {
  image: ImageBitmap;
};

export const imageLayerPlugin: LayerPlugin<
  ImageLayerOptions,
  ImageLayerComputed
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

  UIPanel({options, setOptions}) {
    return (
      <>
        <PanelRow label="URL">
          <input
            type="text"
            value={options.src}
            onChange={(e) => setOptions({...options, src: e.target.value})}
          />
        </PanelRow>
      </>
    );
  },
};
