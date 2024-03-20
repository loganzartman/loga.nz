import {fillLayerPlugin} from '@/app/reacjin/plugins/fillLayer';
import {imageLayerPlugin} from '@/app/reacjin/plugins/imageLayer';
import {textLayerPlugin} from '@/app/reacjin/plugins/textLayer';
import {LayerPlugin} from '@/app/reacjin/plugins/types';

const layerPluginRegistry = {
  fill: fillLayerPlugin,
  image: imageLayerPlugin,
  text: textLayerPlugin,
} as const;

export type PluginID = keyof typeof layerPluginRegistry;

export type PluginOptions<P> = P extends LayerPlugin<infer Options, any>
  ? Options
  : never;

export type PluginByID<ID> = ID extends PluginID
  ? (typeof layerPluginRegistry)[ID]
  : ID extends unknown
  ? LayerPlugin<unknown>
  : never;

export function pluginByID<ID extends string>(id: ID): PluginByID<ID> {
  for (const [pluginID, plugin] of Object.entries(layerPluginRegistry)) {
    if (pluginID === id) return plugin as PluginByID<ID>;
  }
  throw new Error(`Unknown plugin ${id}`);
}
