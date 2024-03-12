import {drawStyledText} from 'canvas-styled-text';
import React from 'react';

import {Panel} from '@/app/reacjin/Panel';
import {PanelRow} from '@/app/reacjin/PanelRow';

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

const textLayerPlugin: LayerPlugin<{
  text: string;
  fontSize: string;
  autoFitText: boolean;
  fontFamily: string;
  fillStyle: string;
  strokeStyle: string;
  strokeWidth: number;
  textAlign: CanvasTextAlign;
}> = {
  draw: (ctx, options) => {
    ctx.fillStyle = options.fillStyle;
    ctx.strokeStyle = options.strokeStyle;
    ctx.lineWidth = options.strokeWidth;
    ctx.lineJoin = 'round';
    ctx.font = `${options.fontSize} ${options.fontFamily}`;
    ctx.textAlign = options.textAlign;
    ctx.textBaseline = 'middle';
    drawStyledText(
      ctx,
      options.text,
      ctx.canvas.width / 2,
      ctx.canvas.height / 2,
    );
  },
  UIPanel: ({options, setOptions}) => {
    return (
      <Panel title="Settings: Text">
        <div className="flex flex-col gap-2 p-2">
          <PanelRow label="text">
            <textarea
              value={options.text}
              onChange={(e) =>
                setOptions({
                  ...options,
                  text: e.currentTarget.value,
                })
              }
            />
          </PanelRow>
          <PanelRow label="font size">
            <input
              className={options.autoFitText ? 'disabled' : ''}
              type="text"
              value={options.fontSize}
              onChange={(e) =>
                setOptions({
                  ...options,
                  fontSize: e.currentTarget.value,
                })
              }
            />
          </PanelRow>
          <PanelRow label="auto-fit text">
            <input
              type="checkbox"
              checked={options.autoFitText}
              onChange={(e) =>
                setOptions({
                  ...options,
                  autoFitText: e.currentTarget.checked,
                })
              }
            />
          </PanelRow>
          <PanelRow label="font family">
            <input
              type="text"
              value={options.fontFamily}
              onChange={(e) =>
                setOptions({
                  ...options,
                  fontFamily: e.currentTarget.value,
                })
              }
            />
          </PanelRow>
          <PanelRow label="fill style">
            <input
              type="text"
              value={options.fillStyle}
              onChange={(e) =>
                setOptions({
                  ...options,
                  fillStyle: e.currentTarget.value,
                })
              }
            />
          </PanelRow>
          <PanelRow label="stroke style">
            <input
              type="text"
              value={options.strokeStyle}
              onChange={(e) =>
                setOptions({
                  ...options,
                  strokeStyle: e.currentTarget.value,
                })
              }
            />
          </PanelRow>
          <PanelRow label="stroke width">
            <input
              type="number"
              value={options.strokeWidth}
              onChange={(e) =>
                setOptions({
                  ...options,
                  strokeWidth: parseInt(e.currentTarget.value),
                })
              }
            />
          </PanelRow>
          <PanelRow label="text align">
            <select
              value={options.textAlign}
              onChange={(e) =>
                setOptions({
                  ...options,
                  textAlign: e.currentTarget.value as CanvasTextAlign,
                })
              }
            >
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="center">center</option>
            </select>
          </PanelRow>
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
