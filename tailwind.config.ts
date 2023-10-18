import typography from '@tailwindcss/typography';
import type {Config} from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        highlight: '#cb93e9',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif'],
        mono: ['var(--font-mono)', 'ui-monospace'],
      },
    },
  },
  plugins: [typography],
};
export default config;
