import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
      blowbrush: ['BlowBrush', 'sans-serif'],
      screens: {
        '1150': '1150px',
      },
    },
  },
  },
  plugins: [typography],
};
