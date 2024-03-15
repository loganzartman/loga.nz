import {PanelRow} from '@/app/reacjin/PanelRow';
import {LayerPlugin} from '@/app/reacjin/plugins/types';

export type FillLayerOptions = {
  fillStyle: string;
};

export const fillLayerPlugin: LayerPlugin<FillLayerOptions> = {
  draw: ({ctx, options}) => {
    ctx.fillStyle = options.fillStyle;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },

  UIPanel({options, setOptions}) {
    return (
      <>
        <PanelRow label="color">
          <input
            type="color"
            value={options.fillStyle}
            onChange={(e) =>
              setOptions({...options, fillStyle: e.target.value})
            }
          />
        </PanelRow>
      </>
    );
  },
};
