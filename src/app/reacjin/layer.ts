import {v4 as uuid} from 'uuid';

import {FillLayerOptions} from '@/app/reacjin/plugins/fillLayer';
import {ImageLayerOptions} from '@/app/reacjin/plugins/imageLayer';
import {
  PluginByID,
  PluginID,
  PluginOptions,
} from '@/app/reacjin/plugins/registry';
import {TextLayerOptions} from '@/app/reacjin/plugins/textLayer';

export type Layer<PluginID extends string> = {
  id: string;
  pluginID: PluginID;
  options: PluginOptions<PluginByID<PluginID>>;
};

export type Layers = Layer<string>[];

export const createLayer = <ID extends PluginID>(
  pluginID: ID,
  options: PluginOptions<PluginByID<ID>>,
): Layer<ID> => ({id: uuid(), pluginID, options});

export const createFillLayer = (
  options?: Partial<FillLayerOptions>,
): Layer<'fill'> => createLayer('fill', {...options, fillStyle: 'transparent'});

export const createTextLayer = (
  options?: Partial<TextLayerOptions>,
): Layer<'text'> =>
  createLayer('text', {
    ...options,
    autoFitText: false,
    fillStyle: 'white',
    fontFamily: 'sans-serif',
    fontSize: 24,
    strokeStyle: 'black',
    strokeWidth: 4,
    text: '',
    textAlign: 'center',
    lineHeight: 1.1,
  });

export const createImageLayer = (
  options?: Partial<ImageLayerOptions>,
): Layer<'image'> =>
  createLayer('image', {
    ...options,
    src: 'data:image/webp;base64,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',
  });
