import React from 'react';

import {Panel} from '@/app/reacjin/Panel';

export interface LayerPlugin<Options> {
  draw(ctx: CanvasRenderingContext2D, options: Options): void;
  UIPanel?: React.FC<{
    options: Options;
    setOptions: (options: Options) => void;
  }>;
}

const image = new Image();
image.src =
  'https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_4x3.jpg?w=256&h=256';

const imageLayerPlugin: LayerPlugin<{}> = {
  draw: (ctx, options) => {
    ctx.drawImage(image, 0, 0);
  },
};

const textLayerPlugin: LayerPlugin<{text: string; font: string}> = {
  draw: (ctx, options) => {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = options.font;
    ctx.fillText(options.text, ctx.canvas.width / 2, ctx.canvas.height / 2);
  },
  UIPanel: ({options, setOptions}) => {
    return (
      <Panel title="Text">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex flex-row gap-2">
            <div>Text</div>
            <input
              type="text"
              value={options.text}
              onChange={(e) =>
                setOptions({
                  ...options,
                  text: e.currentTarget.value,
                })
              }
            />
          </div>
          <div className="flex flex-row gap-2">
            <div>Font</div>
            <input
              type="text"
              value={options.font}
              onChange={(e) =>
                setOptions({
                  ...options,
                  font: e.currentTarget.value,
                })
              }
            />
          </div>
        </div>
      </Panel>
    );
  },
};

const fillLayerPlugin: LayerPlugin<{
  fillStyle: CanvasFillStrokeStyles['fillStyle'];
}> = {
  draw: (ctx, options) => {
    ctx.fillStyle = options.fillStyle;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
};

const layerPlugins = {
  fill: fillLayerPlugin,
  image: imageLayerPlugin,
  text: textLayerPlugin,
} as const;

export type PluginOptions<P> = P extends LayerPlugin<infer Options>
  ? Options
  : unknown;

export type PluginByID<ID> = ID extends keyof typeof layerPlugins
  ? (typeof layerPlugins)[ID]
  : LayerPlugin<unknown>;

export function pluginByID<ID>(id: ID): PluginByID<ID> {
  for (const [pluginID, plugin] of Object.entries(layerPlugins)) {
    if (pluginID === id) return plugin as PluginByID<ID>;
  }
  throw new Error(`Unknown plugin ${id}`);
}
