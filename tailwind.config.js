import typography from '@tailwindcss/typography'
import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
module.exports = {
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
      spacing: {
        ...Object.fromEntries(
          Array.from({ length: 30 }, (_, i) => [i + 1, `${(i + 1) * 0.25}rem`])
        )
      },
      clipPath: {
        'wave-bottom': 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)'
      }
    },
  },
  plugins: [typography],
}
