/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Hiragino Sans',
          'Hiragino Kaku Gothic ProN',
          'Yu Gothic',
          'Meiryo',
          'sans-serif',
        ],
        inter: ['Inter', 'sans-serif'],
        notojp: ['Noto Sans JP', 'sans-serif']
      },
      colors: {
        brand: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
        }
      }
    },
  },
  plugins: [],
};
