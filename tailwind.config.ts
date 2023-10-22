import typography from '@tailwindcss/typography';
import type {Config} from 'tailwindcss';
import {PluginUtils} from 'tailwindcss/types/config';

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
        brand: {
          50: '#FFFBF5',
          100: '#FFF9F0',
          200: '#FFF2DC',
          300: '#FFDB9E',
          400: '#FFC766',
          500: '#FFB029',
          600: '#F09800',
          700: '#B37100',
          800: '#754A00',
          900: '#3D2700',
          950: '#1F1300',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif'],
        mono: ['var(--font-mono)', 'ui-monospace'],
      },
      typography: ({theme}: PluginUtils) => ({
        brand: {
          css: {
            '--tw-prose-body': theme('colors.brand[700]'),
            '--tw-prose-headings': theme('colors.brand[900]'),
            '--tw-prose-lead': theme('colors.brand[600]'),
            '--tw-prose-links': theme('colors.brand[900]'),
            '--tw-prose-bold': theme('colors.brand[900]'),
            '--tw-prose-counters': theme('colors.brand[500]'),
            '--tw-prose-bullets': theme('colors.brand[300]'),
            '--tw-prose-hr': theme('colors.brand[200]'),
            '--tw-prose-quotes': theme('colors.brand[900]'),
            '--tw-prose-quote-borders': theme('colors.brand[200]'),
            '--tw-prose-captions': theme('colors.brand[500]'),
            '--tw-prose-kbd': theme('colors.brand[900]'),
            '--tw-prose-kbd-shadows': theme('colors.brand[900]'),
            '--tw-prose-code': theme('colors.brand[900]'),
            '--tw-prose-pre-code': theme('colors.brand[200]'),
            '--tw-prose-pre-bg': theme('colors.brand[800]'),
            '--tw-prose-th-borders': theme('colors.brand[300]'),
            '--tw-prose-td-borders': theme('colors.brand[200]'),
            '--tw-prose-invert-body': theme('colors.brand[200]'),
            '--tw-prose-invert-headings': theme('colors.brand[200]'),
            '--tw-prose-invert-lead': theme('colors.brand[400]'),
            '--tw-prose-invert-links': theme('colors.brand[300]'),
            '--tw-prose-invert-bold': theme('colors.brand[200]'),
            '--tw-prose-invert-counters': theme('colors.brand[400]'),
            '--tw-prose-invert-bullets': theme('colors.brand[600]'),
            '--tw-prose-invert-hr': theme('colors.brand[700]'),
            '--tw-prose-invert-quotes': theme('colors.brand[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.brand[700]'),
            '--tw-prose-invert-captions': theme('colors.brand[400]'),
            '--tw-prose-invert-kbd': theme('colors.white'),
            '--tw-prose-invert-kbd-shadows': theme('colors.white'),
            '--tw-prose-invert-code': theme('colors.brand[100]'),
            '--tw-prose-invert-pre-code': theme('colors.brand[200]'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 25%)',
            '--tw-prose-invert-th-borders': theme('colors.brand[600]'),
            '--tw-prose-invert-td-borders': theme('colors.brand[700]'),
          },
        },
      }),
    },
  },
  plugins: [typography],
};
export default config;
