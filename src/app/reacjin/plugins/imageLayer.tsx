import {drawStyledText} from 'canvas-styled-text';

import {PanelRow} from '@/app/reacjin/PanelRow';
import {LayerPlugin} from '@/app/reacjin/plugins/types';

export type ImageLayerOptions = {
  src: string;
};

export type ImageLayerComputed = {
  image: ImageBitmap;
};

async function createErrorImage(w: number, h: number, text: string) {
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${(w / Math.max(1, text.length)).toFixed(0)}px monospace`;
  drawStyledText(ctx, text, w / 2, h / 2);

  const image = await createImageBitmap(canvas);
  return image;
}

export const imageLayerPlugin: LayerPlugin<
  ImageLayerOptions,
  ImageLayerComputed
> = {
  compute: async ({src}) => {
    const data = await fetch(src, {credentials: 'omit'});
    if (!data.ok) {
      const image = await createErrorImage(256, 256, 'Bad URL');
      return {
        computed: {image},
        cleanup: () => {
          image.close();
        },
      };
    }

    try {
      const blob = await data.blob();
      const image = await createImageBitmap(blob);
      return {
        computed: {image},
        cleanup: () => image.close(),
      };
    } catch (e) {
      const image = await createErrorImage(256, 256, 'Bad Image');
      return {
        computed: {image},
        cleanup: () => {
          image.close();
        },
      };
    }
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
