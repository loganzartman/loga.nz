'use client';

import {drawStyledText} from 'canvas-styled-text';
import {MdOutlineImage} from 'react-icons/md';

import {Button} from '@/app/reacjin/Button';
import {PanelRow} from '@/app/reacjin/PanelRow';
import {LayerPlugin} from '@/app/reacjin/plugins/types';
import {removeBackground} from '@/app/reacjin/removeBackground';

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

  UIPanel({options, setOptions, ctx}) {
    const uploadFile = async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          const url = URL.createObjectURL(file);
          setOptions({src: url});
        }
      };
      input.click();
    };

    const setFromURL = () => {
      const url = prompt('Enter image URL');
      if (url) {
        setOptions({src: url});
      }
    };

    const handleRemoveBg = async () => {
      const newImage = await removeBackground(
        ctx.canvas,
        ctx.canvas.width,
        ctx.canvas.height,
      );
      ctx.save();
      ctx.globalCompositeOperation = 'copy';
      ctx.drawImage(newImage, 0, 0);
      ctx.restore();
      setOptions({...options, src: ctx.canvas.toDataURL()});
    };

    return (
      <>
        <img
          src={options.src}
          alt="preview"
          className="pointer-events-none select-none w-[256px]"
        />
        {options.src.startsWith('data:') || options.src.startsWith('blob:') ? (
          <div className="flex items-center gap-2">
            <MdOutlineImage />
            <div>Image file</div>
          </div>
        ) : (
          <div className="text-ellipsis w-[40ch]">{options.src}</div>
        )}
        <PanelRow label="Replace" className="items-start mt-4">
          <Button onClick={uploadFile}>Upload</Button>
          <Button onClick={setFromURL}>From URL</Button>
        </PanelRow>
        <PanelRow label="Tools">
          <Button onClick={handleRemoveBg}>Remove background</Button>
        </PanelRow>
      </>
    );
  },
};
