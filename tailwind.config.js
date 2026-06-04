/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1426',
        surface: '#162033',
        border: '#1C3352',
        gold: '#F5C518',
        teal: '#2DD4BF',
        muted: '#8BA3C1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
