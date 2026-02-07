/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        cream: {
          50: '#FEFDFB',
          100: '#FAF7F2',
          200: '#F5F0E8',
          300: '#EDE5D8',
          400: '#DDD2C0',
          500: '#C5B69E',
        },
        gold: {
          300: '#E8D5A8',
          400: '#D4B872',
          500: '#C5A55A',
          600: '#B5893E',
          700: '#96702F',
          800: '#7A5B26',
        },
        charcoal: {
          50: '#F7F6F5',
          100: '#EEEDEB',
          200: '#D9D6D2',
          300: '#B8B3AC',
          400: '#8A8480',
          500: '#6B6560',
          600: '#504B47',
          700: '#3D3935',
          800: '#2D2926',
          900: '#1C1917',
          950: '#0F0E0D',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-up-d1': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.12s forwards',
        'fade-up-d2': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.24s forwards',
        'fade-up-d3': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.36s forwards',
        'fade-up-d4': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.48s forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-down': 'slideDown 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scroll-hint': 'scrollHint 2s ease-in-out infinite',
        'price-pop': 'pricePop 0.35s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollHint: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(8px)' },
        },
        pricePop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
