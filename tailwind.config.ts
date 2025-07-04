// tailwind.config.ts
import { Config } from 'tailwind-merge';
import { withUt } from 'uploadthing/tw';

/** @type {import('tailwindcss').Config} */
// tailwind.config.ts
const config: Config<any, any> = withUt({
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        backgroundMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },


        
        animation: {
          marquee: 'marquee 10s linear infinite',
          'marquee-hover': 'marquee 10s linear infinite paused',
                  backgroundMove: 'backgroundMove 20s ease infinite',
        fadeUp: 'fadeUp 1s ease-out forwards',
        },
      },

  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar')]

})

export default config;
