import {LayerPlugin} from '@/app/reacjin/plugins/types';

export type FillLayerOptions = {
  fillStyle: CanvasFillStrokeStyles['fillStyle'];
};

export const fillLayerPlugin: LayerPlugin<FillLayerOptions> = {
  draw: ({ctx, options}) => {
    ctx.fillStyle = options.fillStyle;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
};
