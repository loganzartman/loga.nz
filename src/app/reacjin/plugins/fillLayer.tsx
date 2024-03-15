import {LayerPlugin} from '@/app/reacjin/plugins/types';

export const fillLayerPlugin: LayerPlugin<{
  fillStyle: CanvasFillStrokeStyles['fillStyle'];
}> = {
  draw: ({ctx, options}) => {
    ctx.fillStyle = options.fillStyle;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },
};
