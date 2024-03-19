import {
  Comic_Neue,
  Lora,
  Noto_Serif,
  Nunito,
  Overpass,
  Roboto_Flex,
  Roboto_Serif,
  Roboto_Slab,
  Work_Sans,
} from 'next/font/google';

const comicNeue = Comic_Neue({weight: ['300', '400', '700'], preload: false});
const lora = Lora({weight: 'variable', preload: false});
const notoSerif = Noto_Serif({weight: 'variable', preload: false});
const nunito = Nunito({weight: 'variable', preload: false});
const overpass = Overpass({weight: 'variable', preload: false});
const roboto = Roboto_Flex({weight: 'variable', preload: false});
const robotoSerif = Roboto_Serif({weight: 'variable', preload: false});
const robotoSlab = Roboto_Slab({weight: 'variable', preload: false});
const workSans = Work_Sans({weight: 'variable', preload: false});

export const allFonts = {
  'Comic Neue': comicNeue,
  Lora: lora,
  'Noto Serif': notoSerif,
  Nunito: nunito,
  Overpass: overpass,
  Roboto: roboto,
  'Roboto Serif': robotoSerif,
  'Roboto Slab': robotoSlab,
  'Work Sans': workSans,
  'sans-serif': {style: {fontFamily: 'sans-serif'}},
  serif: {style: {fontFamily: 'serif'}},
  monospace: {style: {fontFamily: 'monospace'}},
  cursive: {style: {fontFamily: 'cursive'}},
} as const;

export function FontPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      className="select select-sm font-bold"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    >
      {Object.entries(allFonts).map(([name, font]) => (
        <option
          key={name}
          value={name}
          className="text-xl font-bold"
          style={font.style}
        >
          {name}
        </option>
      ))}
    </select>
  );
}
