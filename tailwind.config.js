import typography from '@tailwindcss/typography'
import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      ...defaultTheme.screens,
      'mobile': '920px', 
    },
    extend: {
      fontFamily: {
        blowbrush: ['BlowBrush', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}
