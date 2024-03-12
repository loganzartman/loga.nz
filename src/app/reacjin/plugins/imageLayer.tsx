import {LayerPlugin} from '@/app/reacjin/plugins/types';

const image = new Image();
image.crossOrigin = 'anonymous';
image.src =
  'https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962_4x3.jpg?w=256&h=256';

export const imageLayerPlugin: LayerPlugin<{}> = {
  draw: (ctx, options) => {
    ctx.drawImage(image, 0, 0);
  },
};
