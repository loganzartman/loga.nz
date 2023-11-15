import {generateOgImage} from '@/lib/generate-og-image';

export default async function Image() {
  return generateOgImage({title: 'loga.nz'});
}
