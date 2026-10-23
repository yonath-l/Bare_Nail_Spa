/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          DEFAULT: '#B87A6E',
          light: '#C99388',
          dark: '#A6675B',
        },
        rosewood: {
          DEFAULT: '#9A5C52',
          light: '#B26F64',
          dark: '#824940',
        },
        champagne: {
          DEFAULT: '#C9A66B',
          light: '#D9BC89',
          dark: '#B28E52',
        },
        sage: {
          DEFAULT: '#A9B8A3',
          light: '#C0CDC0',
          dark: '#8FA089',
        },
        linen: {
          DEFAULT: '#F7F1EA',
          50: '#FDFBF9',
          100: '#FAF6F2',
          200: '#F7F1EA',
          300: '#EFE7DC',
          400: '#E4D8C8',
        },
        espresso: {
          DEFAULT: '#2F2522',
          light: '#423531',
          dark: '#1F1816',
        },
        cocoa: {
          DEFAULT: '#3B2E2A',
          light: '#4F3F3A',
          dark: '#271E1B',
        },
        dash: {
          bg: '#FFF5F5',
          soft: '#F7D6D0',
          rose: '#E2B4BD',
          dark: '#4A4A4A',
          muted: '#6B7280',
          card: '#FFFFFF',
          border: '#E8C5C8',
          borderSoft: '#F3D9DC',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.14em',
        'wide-luxury': '0.22em',
      },
      boxShadow: {
        'luxury-subtle': '0 10px 30px -10px rgba(47, 37, 34, 0.08)',
        'luxury-gold': '0 12px 35px -8px rgba(201, 166, 107, 0.28)',
        'luxury-elevated': '0 20px 40px -15px rgba(47, 37, 34, 0.16)',
      }
    },
  },
  plugins: [],
}
